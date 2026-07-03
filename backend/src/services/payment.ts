import Razorpay from "razorpay";
import crypto from "crypto";
import { logger } from "../utils/logger.js";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay =
  razorpayKeyId && razorpayKeySecret
    ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret })
    : null;

export class PaymentService {
  // 1. Razorpay Order Creation
  static async createRazorpayOrder(orderId: string, amount: number, currency: string = "INR") {
    if (!razorpay) {
      logger.error("Razorpay is not configured. Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET.");
      throw new Error("Payment gateway configuration error. Please contact support.");
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paisa
      currency,
      receipt: orderId,
    };

    try {
      return await razorpay.orders.create(options);
    } catch (err: unknown) {
      logger.error("Razorpay order creation failed", {
        orderId,
        error: err instanceof Error ? err.message : String(err),
      });
      throw new Error("Failed to initialize payment with payment gateway.", { cause: err });
    }
  }

  // 2. Razorpay Signature Verification
  static verifyRazorpaySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string,
  ): boolean {
    if (!razorpayKeySecret) {
      logger.error("Razorpay secret key is missing; cannot verify signature.");
      return false;
    }

    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(text)
      .digest("hex");

    return generatedSignature === signature;
  }
}
