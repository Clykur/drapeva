import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticateJWT, requireRole, AuthenticatedRequest } from "../middlewares/auth.js";
import { EmailService } from "../services/email.js";
import { supabase } from "../services/supabase.js";

const router = Router();

const OrderInputSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["COD", "RAZORPAY"]),
  email: z.string().email(),
  phone: z.string(),
  name: z.string().min(2),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
    distance: z.number().min(0).optional(),
  }),
});

// Helper to validate and calculate coupon discount
async function calculateCouponDiscount(coupon: any, cartTotal: number) {
  if (!coupon.is_active) throw new Error("Coupon is inactive");
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
    throw new Error("Coupon has expired");
  if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
    throw new Error("Coupon usage limit reached");
  }
  if (cartTotal < coupon.min_order_value) {
    throw new Error(`Minimum order value of ₹${coupon.min_order_value} required`);
  }

  let discount: number;
  if (coupon.discount_type === "percentage") {
    discount = (cartTotal * coupon.discount_value) / 100;
    if (coupon.max_discount_value) {
      discount = Math.min(discount, coupon.max_discount_value);
    }
  } else {
    discount = coupon.discount_value;
  }
  return discount;
}

// 1. Validate Coupon
router.post("/validate-coupon", async (req: Request, res: Response) => {
  const { code, cartTotal } = req.body;
  if (!code || !cartTotal) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (error || !coupon) {
      return res.status(404).json({ error: "Invalid coupon code" });
    }

    const discount = await calculateCouponDiscount(coupon, cartTotal);
    res.json({ coupon, discount });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get all active coupons
router.get("/coupons", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data: coupons, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("is_active", true);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(coupons);
  } catch (err) {
    next(err);
  }
});

// 2. Create Order & Setup Session
router.post(
  "/",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    try {
      const reqAny = req as any;
      const data = OrderInputSchema.parse(reqAny.body);

      let subtotal = 0;
      const verifiedItems = [];

      // Fetch variants and products to calculate subtotal and check stock
      for (const item of data.items) {
        const { data: variant, error: varErr } = await supabase
          .from("ProductVariant")
          .select("*, product:products(*)")
          .eq("id", item.variantId)
          .maybeSingle();

        if (varErr || !variant) {
          return res.status(400).json({ error: `Product variant ${item.variantId} not found` });
        }

        const product = variant.product;
        if (!product) {
          return res.status(400).json({ error: "Product relation missing" });
        }

        if (variant.stock < item.quantity) {
          return res
            .status(400)
            .json({ error: `Insufficient stock for ${product.name} (${variant.size})` });
        }

        const price = product.price;
        subtotal += price * item.quantity;

        const images = product.product_images || [];
        const mainImage = images.find((im: any) => im.is_featured)?.url || images[0]?.url || "";

        verifiedItems.push({
          variantId: variant.id,
          quantity: item.quantity,
          price,
          productName: product.name,
          product_image: mainImage,
          size: variant.size,
          sku: variant.sku,
          total: price * item.quantity,
        });
      }

      // Shipping & Tax
      const distance = (data.address as any).distance;
      const shippingCost =
        distance !== undefined && distance !== null
          ? distance <= 1000
            ? 0
            : 299
          : subtotal > 50000
            ? 0
            : 1500;
      const tax = subtotal * 0.05; // 5% GST

      // Coupon discount
      let discount = 0;
      let couponId: string | null = null;
      if (data.couponCode) {
        const { data: coupon } = await supabase
          .from("coupons")
          .select("*")
          .eq("code", data.couponCode)
          .maybeSingle();

        if (
          coupon &&
          coupon.is_active &&
          (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) &&
          subtotal >= coupon.min_order_value
        ) {
          couponId = coupon.id;
          discount = await calculateCouponDiscount(coupon, subtotal);
        }
      }

      const total = subtotal - discount + shippingCost + tax;

      // Call database RPC function for atomic order placement
      const { data: order, error: rpcErr } = await supabase.rpc("place_order_atomic", {
        p_user_id: reqAny.user.id,
        p_items: verifiedItems,
        p_coupon_id: couponId,
        p_coupon_code: data.couponCode || null,
        p_payment_method: data.paymentMethod,
        p_email: data.email,
        p_phone: data.phone,
        p_name: data.name,
        p_address: data.address,
        p_subtotal: subtotal,
        p_discount: discount,
        p_shipping_cost: shippingCost,
        p_tax: tax,
        p_total: total,
      });

      if (rpcErr || !order) {
        return res.status(400).json({ error: rpcErr?.message || "Order creation failed" });
      }

      // If COD, send confirmation email immediately
      if (data.paymentMethod === "COD") {
        try {
          await EmailService.sendOrderConfirmation(
            order.customer_email || order.email,
            order.customer_name || order.name,
            order.id,
            order.total,
          );
        } catch (emailErr) {
          console.error("Failed to send COD order confirmation email", emailErr);
        }
      }

      res.status(201).json(order);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors });
      }
      res.status(500).json({ error: err.message });
    }
  },
);

// 3. Get User's Orders
router.get(
  "/my-orders",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", req.user!.id)
        .order("created_at", { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json(orders);
    } catch (err) {
      next(err);
    }
  },
);

// 4. Get Single Order Detail
router.get(
  "/:id",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Auth check: User can only view their own order unless Admin
      if (order.user_id !== req.user!.id && req.user!.role !== "ADMIN") {
        return res.status(403).json({ error: "Unauthorized access to order details" });
      }

      res.json(order);
    } catch (err) {
      next(err);
    }
  },
);

// 5. Update Order Status (Admin Only)
router.put(
  "/:id/status",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: "Status is required" });

    try {
      const { data: order, error } = await supabase
        .from("orders")
        .update({ status: status.toLowerCase() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      await supabase.from("order_status_history").insert({
        order_id: id,
        status: status.toLowerCase(),
        note: `Status updated to ${status} by Administrator`,
      });

      res.json(order);
    } catch (err) {
      next(err);
    }
  },
);

// 6. Get Order Status History (Timeline)
router.get(
  "/:id/timeline",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const { data: order } = await supabase
        .from("orders")
        .select("user_id")
        .eq("id", id)
        .maybeSingle();
      if (!order) return res.status(404).json({ error: "Order not found" });

      if (order.user_id !== req.user!.id && req.user!.role !== "ADMIN") {
        return res.status(403).json({ error: "Access denied" });
      }

      const { data: history, error } = await supabase
        .from("order_status_history")
        .select("*")
        .eq("order_id", id)
        .order("created_at", { ascending: true });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json(history);
    } catch (err) {
      next(err);
    }
  },
);

// 7. Add Comment to Timeline (Admin Only)
router.post(
  "/:id/timeline",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status, action, notes } = req.body;

    try {
      const { data: comment, error } = await supabase
        .from("order_status_history")
        .insert({
          order_id: id,
          status: status || "processing",
          note: notes || action || "Admin update",
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  },
);

// 8. Cancel items in order
router.post(
  "/:id/cancel-items",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { itemIds } = req.body; // Array of item ids or unique variantIds inside items

    if (!itemIds || !Array.isArray(itemIds)) {
      return res.status(400).json({ error: "itemIds array is required" });
    }

    try {
      const { data: order, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !order) return res.status(404).json({ error: "Order not found" });

      if (order.user_id !== req.user!.id && req.user!.role !== "ADMIN") {
        return res.status(403).json({ error: "Unauthorized access" });
      }

      if (order.status === "shipped" || order.status === "delivered") {
        return res
          .status(400)
          .json({ error: "Cannot cancel items of shipped or delivered orders" });
      }

      const items = Array.isArray(order.items) ? order.items : [];
      let refundAmount = 0;
      const updatedItems = [];

      for (const item of items) {
        if (itemIds.includes(item.variantId) || itemIds.includes(item.id)) {
          refundAmount += item.total;
          // Revert stock in ProductVariant
          const { data: variant } = await supabase
            .from("ProductVariant")
            .select("stock")
            .eq("id", item.variantId)
            .maybeSingle();

          if (variant) {
            await supabase
              .from("ProductVariant")
              .update({ stock: (variant.stock || 0) + item.quantity })
              .eq("id", item.variantId);
          }

          // Create inventory release movement
          await supabase.from("inventory_movements").insert({
            variant_id: item.variantId,
            quantity: item.quantity,
            type: "RELEASE",
            notes: `Cancelled from Order ${id}`,
          });
        } else {
          updatedItems.push(item);
        }
      }

      if (updatedItems.length === 0) {
        // Cancel entire order
        await supabase
          .from("orders")
          .update({
            status: "cancelled",
            items: [],
            total: 0,
            subtotal: 0,
          })
          .eq("id", id);

        await supabase.from("order_status_history").insert({
          order_id: id,
          status: "cancelled",
          note: "All items cancelled. Order cancelled.",
        });
      } else {
        const newSubtotal = order.subtotal - refundAmount;
        const newTax = newSubtotal * 0.05;
        const newTotal = newSubtotal - order.discount + order.shipping_cost + newTax;

        await supabase
          .from("orders")
          .update({
            items: updatedItems,
            subtotal: newSubtotal,
            tax: newTax,
            total: Math.max(0, newTotal),
          })
          .eq("id", id);

        await supabase.from("order_status_history").insert({
          order_id: id,
          status: order.status,
          note: `Cancelled items: ${itemIds.join(", ")}. Refund value: ₹${refundAmount}`,
        });
      }

      res.json({
        success: true,
        message: `Successfully cancelled items. Refund value: ₹${refundAmount}`,
      });
    } catch (err) {
      next(err);
    }
  },
);

// 9. Returns / Refunds Workflow
router.post(
  "/:id/return",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { items, reason, comments } = req.body; // items is array of { variantId, quantity }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items array is required for returns" });
    }

    try {
      const { data: order } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      if (!order) return res.status(404).json({ error: "Order not found" });

      if (order.user_id !== req.user!.id) {
        return res.status(403).json({ error: "Unauthorized access" });
      }

      if (order.status !== "delivered") {
        return res.status(400).json({ error: "Only delivered orders can be returned" });
      }

      // Calculate refund amount
      let refundAmount = 0;
      const orderItems = Array.isArray(order.items) ? order.items : [];
      for (const retItem of items) {
        const matching = orderItems.find((oi: any) => oi.variantId === retItem.variantId);
        if (matching) {
          refundAmount += matching.price * Math.min(retItem.quantity, matching.quantity);
        }
      }

      const { data: returnRequest, error } = await supabase
        .from("return_requests")
        .insert({
          order_id: id,
          user_id: req.user!.id,
          items,
          reason,
          comments,
          refund_amount: refundAmount,
          status: "requested",
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      await supabase.from("order_status_history").insert({
        order_id: id,
        status: "returned",
        note: `Return requested for items. Reason: ${reason}. Value: ₹${refundAmount}`,
      });

      res.status(201).json(returnRequest);
    } catch (err) {
      next(err);
    }
  },
);

// 10. List Return Requests (Admin Only)
router.get(
  "/admin/returns",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data: returns, error } = await supabase
        .from("return_requests")
        .select("*, order:orders(*), user:profiles(name, email)")
        .order("created_at", { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json(returns);
    } catch (err) {
      next(err);
    }
  },
);

// 11. Approve/Reject Return Request (Admin Only)
router.put(
  "/admin/returns/:returnId",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { returnId } = req.params;
    const { status, adminNotes } = req.body; // approved, rejected, refunded

    if (!status) return res.status(400).json({ error: "Status is required" });

    try {
      const { data: retReq, error: fetchErr } = await supabase
        .from("return_requests")
        .select("*")
        .eq("id", returnId)
        .maybeSingle();

      if (fetchErr || !retReq) return res.status(404).json({ error: "Return request not found" });

      const { data: updatedReturn, error } = await supabase
        .from("return_requests")
        .update({
          status,
          admin_notes: adminNotes,
        })
        .eq("id", returnId)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (status === "approved" || status === "refunded") {
        // Log movement back to inventory
        const retItems = Array.isArray(retReq.items) ? retReq.items : [];
        for (const item of retItems) {
          const { data: variant } = await supabase
            .from("ProductVariant")
            .select("stock")
            .eq("id", item.variantId)
            .maybeSingle();

          if (variant) {
            await supabase
              .from("ProductVariant")
              .update({ stock: (variant.stock || 0) + item.quantity })
              .eq("id", item.variantId);
          }

          await supabase.from("inventory_movements").insert({
            variant_id: item.variantId,
            quantity: item.quantity,
            type: "RESTOCK",
            notes: `Restocked from Return ${returnId}`,
          });
        }

        // Update order status if completely returned
        await supabase.from("orders").update({ status: "returned" }).eq("id", retReq.order_id);
      }

      await supabase.from("order_status_history").insert({
        order_id: retReq.order_id,
        status: "returned",
        note: `Return request ${returnId} status updated to: ${status} by Admin`,
      });

      res.json(updatedReturn);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
