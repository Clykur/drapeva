import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay =
  razorpayKeyId && razorpayKeySecret
    ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret })
    : null;

export class PaymentService {
  // 1. Razorpay Order Creation
  static async createRazorpayOrder(orderId: string, amount: number, currency: string = "INR") {
    if (!razorpay) {
      throw new Error(
        "CRITICAL SECURITY ERROR: Razorpay Key ID or Secret is missing or unconfigured.",
      );
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paisa
      currency,
      receipt: orderId,
    };

    return await razorpay.orders.create(options);
  }

  // 2. Razorpay Signature Verification
  static verifyRazorpaySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string,
  ): boolean {
    if (!razorpayKeySecret) {
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
