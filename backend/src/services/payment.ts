import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "sk_test_mock_stripe_key";
const isStripeMocked = stripeSecret.includes("mock");
const stripe = !isStripeMocked
  ? new Stripe(stripeSecret, { apiVersion: "2025-01-27.acacia" as any })
  : null;

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "rzp_test_mock_razorpay_key_id";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_mock_razorpay_key_secret";
const isRazorpayMocked = razorpayKeyId.includes("mock");
const razorpay = !isRazorpayMocked
  ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret })
  : null;

export class PaymentService {
  // 1. Stripe Checkout Session
  static async createStripeSession(
    orderId: string,
    amount: number,
    currency: string = "inr",
    successUrl: string,
    cancelUrl: string,
  ) {
    if (isStripeMocked) {
      console.log(
        `[Stripe Mock] Created Checkout Session for Order ${orderId} of ${amount} ${currency.toUpperCase()}`,
      );
      return {
        id: "stripe_mock_session_" + Math.random().toString(36).substring(4),
        url: `${successUrl}?session_id=stripe_mock_session_success`,
      };
    }

    const session = await stripe!.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Drapeva - Order #${orderId}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe expects paisa/cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: orderId,
    });

    return { id: session.id, url: session.url };
  }

  // 2. Razorpay Order Creation
  static async createRazorpayOrder(orderId: string, amount: number, currency: string = "INR") {
    if (isRazorpayMocked) {
      console.log(`[Razorpay Mock] Created Order for ${orderId} of ${amount} ${currency}`);
      return {
        id: "rzp_mock_order_" + Math.random().toString(36).substring(4),
        amount: Math.round(amount * 100),
        currency,
        receipt: orderId,
      };
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paisa
      currency,
      receipt: orderId,
    };

    return await razorpay!.orders.create(options);
  }

  // 3. Razorpay Signature Verification
  static verifyRazorpaySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string,
  ): boolean {
    if (isRazorpayMocked) {
      return true;
    }

    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(text)
      .digest("hex");

    return generatedSignature === signature;
  }
}
