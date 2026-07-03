/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../config/prisma.js";
import { authenticateJWT, requireRole, AuthenticatedRequest } from "../middlewares/auth.js";
import { PaymentService } from "../services/payment.js";
import { EmailService } from "../services/email.js";

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
async function calculateCouponDiscount(
  coupon: any,
  cartTotal: number,
  cartItems: any[],
  userId?: string,
  shippingCost: number = 0,
) {
  if (!coupon.isActive) throw new Error("Coupon is inactive");
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
    throw new Error("Coupon has expired");
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }
  if (cartTotal < coupon.minOrderValue) {
    throw new Error(
      `Minimum order value of ₹${coupon.minOrderValue.toLocaleString("en-IN")} required`,
    );
  }

  if (coupon.type === "FIRST_ORDER") {
    if (!userId) throw new Error("Login required for first order coupon");
    const orderCount = await prisma.order.count({
      where: { userId, status: { not: "CANCELLED" } },
    });
    if (orderCount > 0) throw new Error("First order coupon is only applicable for new customers");
  }

  if (coupon.type === "BIRTHDAY") {
    if (!userId) throw new Error("Login required for birthday coupon");
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.birthday) throw new Error("Birthday not configured on profile");
    const today = new Date();
    if (new Date(user.birthday).getMonth() !== today.getMonth()) {
      throw new Error("Birthday coupon is only valid during your birth month");
    }
  }

  if (coupon.type === "ANNIVERSARY") {
    if (!userId) throw new Error("Login required for anniversary coupon");
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.anniversary) throw new Error("Anniversary date not configured on profile");
    const today = new Date();
    if (new Date(user.anniversary).getMonth() !== today.getMonth()) {
      throw new Error("Anniversary coupon is only valid during your anniversary month");
    }
  }

  if (coupon.type === "PRODUCT") {
    const hasProduct = cartItems.some((item) => item.productId === coupon.productId);
    if (!hasProduct) throw new Error("Coupon is not applicable to any products in your cart");
  }

  if (coupon.type === "COLLECTION") {
    const hasCollection = cartItems.some((item) => item.collectionId === coupon.collectionId);
    if (!hasCollection) throw new Error("Coupon is not applicable to this collection");
  }

  let discount: number;
  if (coupon.type === "FREE_SHIPPING") {
    discount = shippingCost;
  } else if (coupon.discountType === "PERCENTAGE") {
    discount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountValue) {
      discount = Math.min(discount, coupon.maxDiscountValue);
    }
  } else {
    discount = coupon.discountValue;
  }

  return Math.min(discount, cartTotal);
}

// 1. Verify Coupon
router.post("/coupon/apply", async (req: Request, res: Response, _next: NextFunction) => {
  const { code, cartTotal, cartItems, shippingCost, userId } = req.body;
  if (!code) return res.status(400).json({ error: "Coupon code is required" });

  try {
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) return res.status(400).json({ error: "Invalid coupon code" });

    const discount = await calculateCouponDiscount(
      coupon,
      cartTotal,
      cartItems || [],
      userId,
      shippingCost || 0,
    );

    res.json({ coupon, discount });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Auto Apply Best Coupon
router.post("/coupon/best", async (req: Request, res: Response, next: NextFunction) => {
  const { cartTotal, cartItems, shippingCost, userId } = req.body;

  try {
    const coupons = await prisma.coupon.findMany({ where: { isActive: true } });
    let bestCoupon = null;
    let maxDiscount = 0;

    for (const coupon of coupons) {
      try {
        const discount = await calculateCouponDiscount(
          coupon,
          cartTotal,
          cartItems || [],
          userId,
          shippingCost || 0,
        );
        if (discount > maxDiscount) {
          maxDiscount = discount;
          bestCoupon = coupon;
        }
      } catch {
        // Skip coupon if validation fails
      }
    }

    res.json({ coupon: bestCoupon, discount: maxDiscount });
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

      // Calculate pricing in transaction
      const orderDetails = await prisma.$transaction(async (tx: any) => {
        let subtotal = 0;
        const verifiedItems = [];

        for (const item of data.items) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          });

          if (!variant) throw new Error("Product variant not found");
          if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${variant.product.name} (${variant.size})`);
          }

          const price = variant.product.price;
          subtotal += price * item.quantity;
          verifiedItems.push({
            variantId: variant.id,
            quantity: item.quantity,
            price,
          });

          // Decrement stock
          const updatedVariant = await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
            include: { product: true },
          });

          // Notify admins if stock is 3 or less
          if (updatedVariant.stock <= 3) {
            const admins = await tx.user.findMany({ where: { role: "ADMIN" } });
            if (admins.length > 0) {
              const notifications = admins.map((admin: any) => ({
                userId: admin.id,
                type: "LOW_STOCK",
                title: "Low Stock Alert",
                message: `Product ${updatedVariant.product.name} (${updatedVariant.size}) has only ${updatedVariant.stock} units left in stock.`,
              }));
              await tx.notification.createMany({ data: notifications });
            }
          }
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
          const coupon = await tx.coupon.findUnique({ where: { code: data.couponCode } });
          if (
            coupon &&
            coupon.isActive &&
            (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
            subtotal >= coupon.minOrderValue
          ) {
            couponId = coupon.id;
            if (coupon.discountType === "PERCENTAGE") {
              discount = (subtotal * coupon.discountValue) / 100;
              if (coupon.maxDiscountValue) discount = Math.min(discount, coupon.maxDiscountValue);
            } else {
              discount = coupon.discountValue;
            }
          }
        }

        const total = subtotal + tax + shippingCost - discount;

        // Address saving
        const address = await tx.address.create({
          data: {
            userId: reqAny.user!.id,
            type: "SHIPPING",
            name: data.name,
            phone: data.phone,
            line1: data.address.line1,
            line2: data.address.line2,
            city: data.address.city,
            state: data.address.state,
            postalCode: data.address.postalCode,
            country: data.address.country,
          },
        });

        const order = await tx.order.create({
          data: {
            userId: reqAny.user!.id,
            status: "PENDING",
            subtotal,
            tax,
            shippingCost,
            discount,
            total,
            addressId: address.id,
            couponId,
            email: data.email,
            phone: data.phone,
            name: data.name,
            items: {
              create: verifiedItems,
            },
          },
        });

        // Clear current user cart
        const cart = await tx.cart.findUnique({ where: { userId: reqAny.user!.id } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }

        return { order, total };
      });

      // Generate Payment links or handle COD directly
      let checkoutDetails = {};
      if (data.paymentMethod === "COD") {
        // Direct processing for COD orders
        await prisma.order.update({
          where: { id: orderDetails.order.id },
          data: { status: "PROCESSING" },
        });

        await prisma.payment.create({
          data: {
            orderId: orderDetails.order.id,
            method: "COD",
            status: "PENDING",
            transactionId: "COD-" + orderDetails.order.id,
            amount: orderDetails.total,
          },
        });

        await EmailService.sendOrderConfirmation(
          orderDetails.order.email,
          orderDetails.order.name,
          orderDetails.order.id,
          orderDetails.total,
        );

        checkoutDetails = { paymentMethod: "COD", success: true };
      } else {
        const order = await PaymentService.createRazorpayOrder(
          orderDetails.order.id,
          orderDetails.total,
        );
        checkoutDetails = { paymentMethod: "RAZORPAY", orderId: order.id, amount: order.amount };
      }

      res.status(201).json({
        order: orderDetails.order,
        ...checkoutDetails,
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors });
      }
      res.status(400).json({ error: err.message });
    }
  },
);

// 3. Verify Payment
router.post(
  "/verify-payment",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { orderId, razorpayPaymentId, razorpayOrderId, signature } = req.body;

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (order.userId !== req.user!.id) {
        return res.status(403).json({ error: "Access denied: Order ownership mismatch" });
      }

      let success = false;
      let transactionId = "";
      let method = "";

      if (signature) {
        success = PaymentService.verifyRazorpaySignature(
          razorpayOrderId,
          razorpayPaymentId,
          signature,
        );
        transactionId = razorpayPaymentId;
        method = "RAZORPAY";
      }

      if (success) {
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { status: "PROCESSING" },
        });

        // Create Payment log
        await prisma.payment.create({
          data: {
            orderId,
            method,
            status: "COMPLETED",
            transactionId,
            amount: updatedOrder.total,
          },
        });

        // Send order emails & messages
        await EmailService.sendOrderConfirmation(
          updatedOrder.email,
          updatedOrder.name,
          updatedOrder.id,
          updatedOrder.total,
        );

        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        res.status(400).json({ error: "Payment verification failed" });
      }
    } catch (err) {
      next(err);
    }
  },
);

// 4. Retrieve Order History (Admin or User's own)
router.get(
  "/",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const orders = await prisma.order.findMany({
        where: req.user!.role === "ADMIN" ? {} : { userId: req.user!.id },
        include: {
          items: {
            include: {
              variant: { include: { product: true } },
            },
          },
          address: true,
        },
        orderBy: { createdAt: "desc" },
      });
      res.json(orders);
    } catch (err) {
      next(err);
    }
  },
);

// 5. Get Order Details & Tracking
router.get(
  "/:id",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const reqAny = req as any;
    const { id } = reqAny.params;

    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              variant: { include: { product: true } },
            },
          },
          address: true,
          payments: true,
        },
      });

      if (!order) return res.status(404).json({ error: "Order not found" });

      // Validate ownership
      if (reqAny.user!.role !== "ADMIN" && order.userId !== reqAny.user!.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(order);
    } catch (err) {
      next(err);
    }
  },
);

// 6. Update Status (Admin Only)
router.put(
  "/:id/status",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;

    try {
      const existingOrder = await prisma.order.findUnique({ where: { id } });
      if (!existingOrder) return res.status(404).json({ error: "Order not found" });

      if (existingOrder.status === "DELIVERED" || existingOrder.status === "CANCELLED") {
        return res
          .status(400)
          .json({ error: `Cannot change status of a ${existingOrder.status} order` });
      }

      if (
        existingOrder.status === "SHIPPED" &&
        status !== "DELIVERED" &&
        status !== "CANCELLED" &&
        status !== "RETURNED"
      ) {
        return res
          .status(400)
          .json({ error: "Cannot change status of a shipped order back to processing/pending" });
      }

      const order = await prisma.order.update({
        where: { id: id as string },
        data: { status },
      });

      // Log to timeline
      await prisma.orderTimeline.create({
        data: {
          orderId: id,
          status,
          action: "STATUS_UPDATE",
          notes: `Status updated by Admin to: ${status}`,
        },
      });

      // Notify Customer via Email
      const displayCode = `ORD-${order.id.slice(0, 8).toUpperCase()}`;

      await EmailService.sendEmail(
        order.email,
        `Your Drapeva Order Update - ${displayCode}`,
        `<p>Dear ${order.name},</p><p>The status of your order <strong>${displayCode}</strong> has been updated to: <strong>${status}</strong>.</p>`,
      );

      res.json(order);
    } catch (err) {
      next(err);
    }
  },
);

// 7. Get Order Timeline (Admin or User's own)
router.get(
  "/:id/timeline",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    try {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) return res.status(404).json({ error: "Order not found" });

      if (req.user!.role !== "ADMIN" && order.userId !== req.user!.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      const timeline = await prisma.orderTimeline.findMany({
        where: req.user!.role === "ADMIN" ? { orderId: id } : { orderId: id, isAdminOnly: false },
        orderBy: { createdAt: "asc" },
      });

      res.json(timeline);
    } catch (err) {
      next(err);
    }
  },
);

// 8. Add Admin Comment
router.post(
  "/:id/comments",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { notes, isAdminOnly } = req.body;

    if (!notes) return res.status(400).json({ error: "Comment notes are required" });

    try {
      const comment = await prisma.orderTimeline.create({
        data: {
          orderId: id,
          status: "COMMENT",
          action: "ADMIN_COMMENT",
          notes,
          isAdminOnly: isAdminOnly !== undefined ? isAdminOnly : true,
        },
      });

      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  },
);

// 9. Partial Cancellation
router.post(
  "/:id/cancel-partial",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { itemIds } = req.body; // Array of OrderItem IDs to cancel

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ error: "Item IDs to cancel are required" });
    }

    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!order) return res.status(404).json({ error: "Order not found" });

      if (req.user!.role !== "ADMIN" && order.userId !== req.user!.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (order.status === "SHIPPED" || order.status === "DELIVERED") {
        return res
          .status(400)
          .json({ error: "Cannot cancel items of shipped or delivered orders" });
      }

      let refundAmount = 0;
      await prisma.$transaction(async (tx: any) => {
        for (const itemId of itemIds) {
          const item = order.items.find((i: any) => i.id === itemId);
          if (!item) throw new Error(`Item ${itemId} not found in this order`);

          // Restock variant
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });

          // Track inventory movement
          await tx.inventoryMovement.create({
            data: {
              variantId: item.variantId,
              quantity: item.quantity,
              type: "RELEASE",
              notes: `Restocked due to partial cancellation of order ${order.id}`,
            },
          });

          // Delete OrderItem
          await tx.orderItem.delete({ where: { id: itemId } });
          refundAmount += item.price * item.quantity;
        }

        const remainingItems = await tx.orderItem.findMany({ where: { orderId: id } });
        if (remainingItems.length === 0) {
          await tx.order.update({
            where: { id },
            data: { status: "CANCELLED", subtotal: 0, tax: 0, total: 0 },
          });
          await tx.orderTimeline.create({
            data: {
              orderId: id,
              status: "CANCELLED",
              action: "ORDER_CANCELLED",
              notes: "All items cancelled",
            },
          });
        } else {
          const newSubtotal = remainingItems.reduce(
            (acc: number, curr: any) => acc + curr.price * curr.quantity,
            0,
          );
          const newTax = newSubtotal * 0.05;
          const newTotal = newSubtotal + newTax + order.shippingCost - order.discount;

          await tx.order.update({
            where: { id },
            data: { subtotal: newSubtotal, tax: newTax, total: newTotal },
          });

          await tx.orderTimeline.create({
            data: {
              orderId: id,
              status: "PROCESSING",
              action: "PARTIAL_CANCELLATION",
              notes: `Cancelled items: ${itemIds.join(", ")}. Refund value: ₹${refundAmount}`,
            },
          });
        }
      });

      res.json({
        success: true,
        message: `Successfully cancelled items. Refund value: ₹${refundAmount}`,
      });
    } catch (err: any) {
      next(err);
    }
  },
);

// 10. Partial Refund
router.post(
  "/:id/refund-partial",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { amount, reason } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ error: "Valid refund amount is required" });

    try {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) return res.status(404).json({ error: "Order not found" });

      // Create Payment log for refund
      const refundPayment = await prisma.payment.create({
        data: {
          orderId: id,
          method: "REFUND",
          status: "REFUNDED",
          transactionId: `REF-${Math.random().toString(36).substring(4).toUpperCase()}`,
          amount: -Number(amount),
        },
      });

      await prisma.orderTimeline.create({
        data: {
          orderId: id,
          status: order.status,
          action: "PARTIAL_REFUND",
          notes: `Refunded ₹${amount}. Reason: ${reason || "N/A"}`,
        },
      });

      res.status(201).json(refundPayment);
    } catch (err) {
      next(err);
    }
  },
);

// 11. Resend Order Confirmation Email
router.post(
  "/:id/resend-confirmation",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    try {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) return res.status(404).json({ error: "Order not found" });

      await EmailService.sendOrderConfirmation(order.email, order.name, order.id, order.total);

      await prisma.orderTimeline.create({
        data: {
          orderId: id,
          status: order.status,
          action: "EMAIL_RESENT",
          notes: "Resent order confirmation email to customer",
          isAdminOnly: true,
        },
      });

      res.json({ success: true, message: "Confirmation email resent" });
    } catch (err) {
      next(err);
    }
  },
);

// 12. Resend Invoice
router.post(
  "/:id/resend-invoice",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: { include: { variant: { include: { product: true } } } } },
      });
      if (!order) return res.status(404).json({ error: "Order not found" });

      const invoiceHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
          <h2>TAX INVOICE</h2>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Date:</strong> ${order.createdAt.toDateString()}</p>
          <hr />
          <p><strong>Billed To:</strong> ${order.name}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="border-bottom: 2px solid #ddd; text-align: left;">
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item: any) => `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td>${item.variant.product.name} (${item.variant.size})</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toLocaleString("en-IN")}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <p style="text-align: right;"><strong>Subtotal:</strong> ₹${order.subtotal.toLocaleString("en-IN")}</p>
          <p style="text-align: right;"><strong>GST (5%):</strong> ₹${order.tax.toLocaleString("en-IN")}</p>
          <p style="text-align: right;"><strong>Shipping:</strong> ₹${order.shippingCost.toLocaleString("en-IN")}</p>
          <p style="text-align: right; font-size: 1.2em;"><strong>Total:</strong> ₹${order.total.toLocaleString("en-IN")}</p>
        </div>
      `;

      await EmailService.sendEmail(
        order.email,
        `Tax Invoice for Order #${order.id.slice(0, 8).toUpperCase()}`,
        invoiceHtml,
      );

      await prisma.orderTimeline.create({
        data: {
          orderId: id,
          status: order.status,
          action: "EMAIL_RESENT",
          notes: "Resent invoice email to customer",
          isAdminOnly: true,
        },
      });

      res.json({ success: true, message: "Invoice email resent" });
    } catch (err) {
      next(err);
    }
  },
);

// 13. Manual Payment Verification
router.post(
  "/:id/verify-payment-manual",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { transactionId, notes } = req.body;

    try {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) return res.status(404).json({ error: "Order not found" });

      if (order.status !== "PENDING") {
        return res.status(400).json({ error: "Only PENDING orders can be verified manually" });
      }

      await prisma.$transaction(async (tx: any) => {
        await tx.order.update({
          where: { id },
          data: { status: "PROCESSING" },
        });

        await tx.payment.create({
          data: {
            orderId: id,
            method: "MANUAL",
            status: "COMPLETED",
            transactionId:
              transactionId || `MAN-${Math.random().toString(36).substring(4).toUpperCase()}`,
            amount: order.total,
          },
        });

        await tx.orderTimeline.create({
          data: {
            orderId: id,
            status: "PROCESSING",
            action: "MANUAL_PAYMENT_VERIFIED",
            notes: notes || "Payment verified manually by admin",
          },
        });
      });

      res.json({ success: true, message: "Order payment verified manually" });
    } catch (err) {
      next(err);
    }
  },
);

// 14. Retry Action
router.post(
  "/:id/retry-action",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { actionType } = req.body; // e.g., "SHIPMENT", "NOTIFICATION"

    try {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) return res.status(404).json({ error: "Order not found" });

      await prisma.orderTimeline.create({
        data: {
          orderId: id,
          status: order.status,
          action: "RETRY_ACTION",
          notes: `Retried action: ${actionType}`,
          isAdminOnly: true,
        },
      });

      res.json({ success: true, message: `Retry for action ${actionType} triggered successfully` });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
