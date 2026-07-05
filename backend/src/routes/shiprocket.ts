/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response, NextFunction } from "express";
import { authenticateJWT, requireRole } from "../middlewares/auth.js";
import { ShiprocketService } from "../services/shiprocket.js";
import { EmailService } from "../services/email.js";
import { logger } from "../utils/logger.js";
import env from "../config/env.js";
import { supabase } from "../services/supabase.js";

const router = Router();

// Helper to log timeline
async function logOrderTimeline(
  orderId: string,
  status: string,
  action: string,
  notes?: string,
  _isAdminOnly: boolean = false,
) {
  try {
    await supabase.from("order_status_history").insert({
      order_id: orderId,
      status,
      note: notes || action,
    });
  } catch (err: unknown) {
    logger.error("[Timeline Log Error] Failed", {
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

// 1. Create Shipment
router.post(
  "/create-shipment",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: "Order ID is required" });

    try {
      const { data: order, error: fetchErr } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();

      if (fetchErr || !order) return res.status(404).json({ error: "Order not found" });

      if (
        order.status === "CANCELLED" ||
        order.status === "DELIVERED" ||
        order.status === "SHIPPED"
      ) {
        return res.status(400).json({ error: `Cannot ship order in ${order.status} state` });
      }

      // Check if already shipped in Shiprocket
      if (order.shipmentId) {
        return res.status(400).json({ error: "Shipment already created for this order" });
      }

      const rawItems = Array.isArray(order.items) ? order.items : [];
      const orderItems = rawItems.map((item: any) => ({
        name: item.product_name || item.productName || "Heritage Saree",
        sku: item.sku || item.sku_code || "GEN-SKU",
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 5,
        hsn: 5007, // HSN code for Silk fabrics/sarees
      }));

      const addr = order.shipping_address || {};
      const payload = {
        order_id: order.id,
        order_date: new Date(order.created_at).toISOString().replace(/T/, " ").replace(/\..+/, ""),
        pickup_location: "Drapeva Mumbai Studio",
        billing_customer_name: order.customer_name || order.name || "Customer",
        billing_last_name: "",
        billing_address: addr.line1 || "",
        billing_address_2: addr.line2 || "",
        billing_city: addr.city || "",
        billing_pincode: addr.postalCode || addr.postal_code || "",
        billing_state: addr.state || "",
        billing_country: addr.country || "India",
        billing_email: order.customer_email || order.email || "",
        billing_phone: order.customer_phone || order.phone || "",
        shipping_is_billing: true,
        order_items: orderItems,
        payment_method: "Prepaid",
        sub_total: order.subtotal,
        length: 30,
        width: 25,
        height: 10,
        weight: 1.5,
      };

      const result = await ShiprocketService.createOrder(payload);

      if (result.error) {
        return res
          .status(400)
          .json({ error: result.message || "Failed to create Shiprocket order" });
      }

      // Update Order with Shiprocket details
      const { data: updatedOrder, error: updateErr } = await supabase
        .from("orders")
        .update({
          shiprocketOrderId: String(result.order_id),
          shipmentId: String(result.shipment_id),
          awbNumber: result.awb_code,
          courierName: result.courier_name || "Delhivery",
          trackingUrl: `https://shiprocket.co/tracking/${result.awb_code}`,
          estimatedDelivery: result.estimated_delivery_date,
          status: "shipped",
          shippedAt: new Date().toISOString(),
        })
        .eq("id", orderId)
        .select()
        .single();

      if (updateErr) {
        return res.status(500).json({ error: updateErr.message });
      }

      // Send Shipped Email
      const displayCode = `ORD-${order.id.slice(0, 8).toUpperCase()}`;
      await EmailService.sendEmail(
        order.customer_email || order.email,
        `Your Drapeva Saree has Shipped! - ${displayCode}`,
        `<p>Dear ${order.customer_name || order.name},</p>
         <p>Your luxury saree has been shipped! Here are the tracking details:</p>
         <ul>
           <li><strong>AWB Code:</strong> ${result.awb_code}</li>
           <li><strong>Courier Partner:</strong> ${result.courier_name}</li>
           <li><strong>Tracking URL:</strong> <a href="https://shiprocket.co/tracking/${result.awb_code}">Track Shipment</a></li>
           <li><strong>Estimated Delivery:</strong> ${result.estimated_delivery_date || "3-5 days"}</li>
         </ul>`,
      );

      await logOrderTimeline(
        orderId,
        "SHIPPED",
        "SHIPMENT_CREATION",
        `Shipment created. AWB: ${result.awb_code}, Courier: ${result.courier_name}`,
      );

      res.json(updatedOrder);
    } catch (err: any) {
      next(err);
    }
  },
);

// 2. Webhook Status Synchronization
router.post("/webhook", async (req: Request, res: Response, _next: NextFunction) => {
  const payload = req.body;

  logger.debug(`[Shiprocket Webhook] Received payload`, { awb: payload?.awb });

  const { awb, current_status, etd } = payload;
  if (!awb) return res.status(400).json({ error: "Missing AWB" });

  try {
    const { data: order, error: fetchErr } = await supabase
      .from("orders")
      .select("*")
      .eq("awbNumber", awb)
      .maybeSingle();

    if (fetchErr || !order) {
      console.warn(`[Shiprocket Webhook] Order with AWB ${awb} not found`);
      return res.status(200).json({ success: true, message: "Ignored, order not found" });
    }

    let nextStatus = order.status;
    let action = "SHIPMENT_UPDATE";

    if (current_status === "Delivered") {
      nextStatus = "delivered";
      action = "SHIPMENT_DELIVERED";
    } else if (current_status === "Cancelled") {
      nextStatus = "cancelled";
      action = "SHIPMENT_CANCELLED";
    }

    await supabase
      .from("orders")
      .update({
        shippingStatus: current_status,
        status: nextStatus,
        deliveredAt: current_status === "Delivered" ? new Date().toISOString() : order.deliveredAt,
      })
      .eq("id", order.id);

    await logOrderTimeline(
      order.id,
      nextStatus,
      action,
      `Shiprocket status updated to: ${current_status}. ETD: ${etd || "N/A"}`,
    );

    if (current_status === "Delivered") {
      await EmailService.sendEmail(
        order.customer_email || order.email,
        `Your Drapeva Saree has been Delivered!`,
        `<p>Dear ${order.customer_name || order.name},</p>
         <p>We are delighted that your curated heritage piece has arrived safely. We hope it brings you joy.</p>
         <p>Would you kindly share your review of the fabric and draping experience? <a href="${env.FRONTEND_URL}/orders/${order.id}">Leave a Review</a></p>`,
      );
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("[Shiprocket Webhook Error]:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. Serviceability Check
router.get("/serviceability", async (req: Request, res: Response, next: NextFunction) => {
  const { pickupPostcode, deliveryPostcode, weight } = req.query;

  if (!pickupPostcode || !deliveryPostcode || !weight) {
    return res
      .status(400)
      .json({ error: "Missing query parameters: pickupPostcode, deliveryPostcode, weight" });
  }

  try {
    const result = await ShiprocketService.checkServiceability(
      String(pickupPostcode),
      String(deliveryPostcode),
      Number(weight),
    );
    res.json(result);
  } catch (err: any) {
    next(err);
  }
});

// 4. Print Label
router.post(
  "/label",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { shipmentId } = req.body;
    try {
      const result = await ShiprocketService.generateLabel([Number(shipmentId)]);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

// 5. Print Invoice
router.post(
  "/invoice",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.body;
    try {
      const result = await ShiprocketService.generateInvoice([Number(orderId)]);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

// 6. Download Manifest
router.post(
  "/manifest",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { shipmentId } = req.body;
    try {
      const result = await ShiprocketService.generateManifest([Number(shipmentId)]);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

// 7. Cancel Shipment
router.post(
  "/cancel",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { shipmentId, orderId } = req.body;
    try {
      const result = await ShiprocketService.cancelShipment(Number(shipmentId));
      if (orderId) {
        await logOrderTimeline(
          orderId,
          "PROCESSING",
          "SHIPMENT_CANCELLED",
          `Shipment with ID ${shipmentId} cancelled in Shiprocket.`,
        );
        await supabase
          .from("orders")
          .update({
            shipmentId: null,
            awbNumber: null,
            courierName: null,
            trackingUrl: null,
            shippingStatus: "CANCELLED",
          })
          .eq("id", orderId);
      }
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

// 8. Track Shipment AWB
router.get("/track/:awb", async (req: Request, res: Response, next: NextFunction) => {
  const { awb } = req.params as { awb: string };
  try {
    const result = await ShiprocketService.getTrackingInfo(awb);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
