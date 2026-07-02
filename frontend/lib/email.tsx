import { sendEmail } from "./zeptomail";
import React from "react";
import { OrderConfirmationEmail } from "@/components/emails/OrderConfirmationEmail";
import { AdminOrderNotificationEmail } from "@/components/emails/AdminOrderNotificationEmail";
import { OrderShippedEmail } from "@/components/emails/OrderShippedEmail";
import { OrderDeliveredEmail } from "@/components/emails/OrderDeliveredEmail";
import { getSupabaseAdmin } from "@/lib/supabase";

// Check and update email logs to prevent duplicate sending
async function markEmailAsSent(
  orderId: string,
  emailType: string,
  caller: string,
): Promise<boolean> {
  try {
    const stackLines = new Error().stack?.split("\n") || [];
    const callerStack = stackLines
      .slice(2, 6)
      .map((line) => line.trim())
      .join(" -> ");
    console.log(
      `[Email Service Trace] Request to send "${emailType}" for order ${orderId} | Caller: "${caller}" | Stack: ${callerStack}`,
    );

    const supabase = getSupabaseAdmin();
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("email_sent_logs")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      console.error(
        `[Email Service] Failed to retrieve email sent logs for order: ${orderId}`,
        fetchError,
      );
      return false;
    }

    const logs = Array.isArray(order.email_sent_logs) ? order.email_sent_logs : [];

    // If already sent, skip sending
    if (logs.includes(emailType)) {
      console.log(
        `[Email Service Aborted] Email type "${emailType}" already sent for order: ${orderId}. Skipping. (Triggered by: "${caller}")`,
      );
      return true; // Already processed
    }

    // Update with new log atomically, only if the column does not already contain the value
    const updatedLogs = [...logs, emailType];
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({ email_sent_logs: updatedLogs })
      .eq("id", orderId)
      .not("email_sent_logs", "cs", JSON.stringify([emailType]))
      .select();

    if (updateError) {
      console.error(
        `[Email Service] Failed to update email sent logs for order: ${orderId}`,
        updateError,
      );
      return false;
    }

    // If updatedOrder is empty, the row didn't match the .not() condition because another call already updated it
    if (!updatedOrder || updatedOrder.length === 0) {
      console.warn(
        `[Email Service Concurrency Guard] Duplicate prevention triggered! Email type "${emailType}" was already sent for order: ${orderId}. Skipping. (Triggered by: "${caller}")`,
      );
      return true; // Already processed by concurrent request
    }

    return false; // Email has NOT been sent before; proceed to send
  } catch (error) {
    console.error(`[Email Service] Error checking email sent logs:`, error);
    return false; // Fallback to send in case of DB issues (failure-tolerant)
  }
}

// ------------------------------------------------------------
async function sendEmailDirect(to: string, subject: string, html: string) {
  if (!to) {
    console.error("[Email Service] Recipient email is empty.");
    return null;
  }

  console.log(`[Email Service] Preparing to dispatch email to: "${to}" | Subject: "${subject}"`);

  try {
    return await sendEmail(to, subject, html);
  } catch (err: any) {
    console.error(`[Email Service] Failed to send email to "${to}":`, err);
    throw err;
  }
}

// ------------------------------------------------------------
// Standalone Reusable Email functions
// ------------------------------------------------------------

export async function sendOrderConfirmationToCustomer(
  to: string,
  name: string,
  orderId: string,
  orderData: {
    items: any[];
    subtotal: number;
    tax: number;
    shippingCost: number;
    discount: number;
    total: number;
    shippingAddress: any;
    paymentMethod: string;
  },
) {
  console.log(`[Email Service] sendOrderConfirmationToCustomer: Order ${orderId} | to: ${to}`);
  try {
    if (!to || !to.includes("@")) {
      console.error(`[Email Service] Invalid customer email: "${to}"`);
      return null;
    }

    // Verify email exists in database (either profiles or orders)
    const supabase = getSupabaseAdmin();
    const [profileCheck, orderCheck] = await Promise.all([
      supabase.from("profiles").select("id").eq("email", to).maybeSingle(),
      supabase.from("orders").select("id").eq("customer_email", to).maybeSingle(),
    ]);

    if (!profileCheck.data && !orderCheck.data) {
      console.warn(
        `[Email Service] Email "${to}" not found in profiles or orders database. Skipping send.`,
      );
      return null;
    }

    // 1. Prevent duplicate email sending
    const alreadySent = await markEmailAsSent(
      orderId,
      "customer_confirmation",
      "sendOrderConfirmationToCustomer",
    );
    if (alreadySent) {
      console.log(
        `[Email Service] Customer confirmation already sent to ${to} for order ${orderId}.`,
      );
      return { status: "already_sent" };
    }

    // 2. Render HTML Email
    const { renderToStaticMarkup } = await import("react-dom/server");
    // Fetch order_number for human-readable display
    const { data: orderRow } = await supabase
      .from("orders")
      .select("order_number")
      .eq("id", orderId)
      .maybeSingle();
    const orderCode = orderRow?.order_number || orderId.slice(0, 8).toUpperCase();
    const emailHtml = renderToStaticMarkup(
      <OrderConfirmationEmail
        customerName={name}
        orderCode={orderCode}
        items={orderData.items}
        subtotal={orderData.subtotal}
        tax={orderData.tax}
        shippingCost={orderData.shippingCost}
        discount={orderData.discount}
        total={orderData.total}
        shippingAddress={orderData.shippingAddress}
        paymentMethod={orderData.paymentMethod}
      />,
    );

    // 3. Dispatch
    return await sendEmailDirect(to, "Your Drapeva Order has been Confirmed ✨", emailHtml);
  } catch (err) {
    console.error(`[Email Service] sendOrderConfirmationToCustomer failed for ${to}:`, err);
    return null;
  }
}

export async function sendAdminOrderNotification(
  orderId: string,
  orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    items: any[];
    total: number;
    shippingAddress: any;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
  },
) {
  const adminEmail = "drapeva2026@gmail.com";
  console.log(`[Email Service] sendAdminOrderNotification: Order ${orderId}`);
  try {
    // 1. Prevent duplicate email sending
    const alreadySent = await markEmailAsSent(
      orderId,
      "admin_notification",
      "sendAdminOrderNotification",
    );
    if (alreadySent) {
      console.log(`[Email Service] Admin notification already sent for order ${orderId}.`);
      return { status: "already_sent" };
    }

    // Fetch order_number for human-readable display
    const supabase = getSupabaseAdmin();
    const { data: orderRow } = await supabase
      .from("orders")
      .select("order_number")
      .eq("id", orderId)
      .maybeSingle();
    const orderCode = orderRow?.order_number || orderId.slice(0, 8).toUpperCase();

    // 2. Render HTML Email
    const { renderToStaticMarkup } = await import("react-dom/server");
    const emailHtml = renderToStaticMarkup(
      <AdminOrderNotificationEmail
        customerName={orderData.customerName}
        customerEmail={orderData.customerEmail}
        customerPhone={orderData.customerPhone}
        orderCode={orderCode}
        internalId={orderId}
        items={orderData.items}
        total={orderData.total}
        shippingAddress={orderData.shippingAddress}
        paymentMethod={orderData.paymentMethod}
        paymentStatus={orderData.paymentStatus}
        createdAt={orderData.createdAt}
      />,
    );

    // 3. Dispatch
    return await sendEmailDirect(adminEmail, "New Drapeva Order Received", emailHtml);
  } catch (err) {
    console.error(`[Email Service] sendAdminOrderNotification failed for order ${orderId}:`, err);
    return null;
  }
}

export async function sendOrderShippedEmail(
  to: string,
  name: string,
  orderId: string,
  shippingData: {
    courierName: string;
    trackingNumber: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
    items: any[];
  },
) {
  console.log(`[Email Service] sendOrderShippedEmail: Order ${orderId} | to: ${to}`);
  try {
    if (!to || !to.includes("@")) {
      console.error(`[Email Service] Invalid customer email for shipping: "${to}"`);
      return null;
    }

    // Verify email exists in database (either profiles or orders)
    const supabase = getSupabaseAdmin();
    const [profileCheck, orderCheck] = await Promise.all([
      supabase.from("profiles").select("id").eq("email", to).maybeSingle(),
      supabase.from("orders").select("id").eq("customer_email", to).maybeSingle(),
    ]);

    if (!profileCheck.data && !orderCheck.data) {
      console.warn(
        `[Email Service] Email "${to}" not found in profiles or orders database. Skipping shipped email.`,
      );
      return null;
    }

    // 1. Prevent duplicate email sending
    const alreadySent = await markEmailAsSent(orderId, "order_shipped", "sendOrderShippedEmail");
    if (alreadySent) {
      console.log(`[Email Service] Shipping email already sent to ${to} for order ${orderId}.`);
      return { status: "already_sent" };
    }

    // Fetch order_number for human-readable display
    const supabaseAdmin = getSupabaseAdmin();
    const { data: orderRow } = await supabaseAdmin
      .from("orders")
      .select("order_number")
      .eq("id", orderId)
      .maybeSingle();
    const orderCode = orderRow?.order_number || orderId.slice(0, 8).toUpperCase();

    // 2. Render HTML Email
    const { renderToStaticMarkup } = await import("react-dom/server");
    const emailHtml = renderToStaticMarkup(
      <OrderShippedEmail
        customerName={name}
        orderCode={orderCode}
        courierName={shippingData.courierName}
        trackingNumber={shippingData.trackingNumber}
        trackingUrl={shippingData.trackingUrl}
        estimatedDelivery={shippingData.estimatedDelivery}
        items={shippingData.items}
      />,
    );

    // 3. Dispatch
    return await sendEmailDirect(to, "Your Drapeva Order is on the Way 🚚", emailHtml);
  } catch (err) {
    console.error(`[Email Service] sendOrderShippedEmail failed for ${to}:`, err);
    return null;
  }
}

export async function sendOrderDeliveredEmail(
  to: string,
  name: string,
  orderId: string,
  deliveryData: {
    deliveredDate: string;
    items: any[];
  },
) {
  console.log(`[Email Service] sendOrderDeliveredEmail: Order ${orderId} | to: ${to}`);
  try {
    if (!to || !to.includes("@")) {
      console.error(`[Email Service] Invalid customer email for delivery confirmation: "${to}"`);
      return null;
    }

    // Verify email exists in database (either profiles or orders)
    const supabase = getSupabaseAdmin();
    const [profileCheck, orderCheck] = await Promise.all([
      supabase.from("profiles").select("id").eq("email", to).maybeSingle(),
      supabase.from("orders").select("id").eq("customer_email", to).maybeSingle(),
    ]);

    if (!profileCheck.data && !orderCheck.data) {
      console.warn(
        `[Email Service] Email "${to}" not found in profiles or orders database. Skipping delivered email.`,
      );
      return null;
    }

    // 1. Prevent duplicate email sending
    const alreadySent = await markEmailAsSent(
      orderId,
      "order_delivered",
      "sendOrderDeliveredEmail",
    );
    if (alreadySent) {
      console.log(`[Email Service] Delivery email already sent to ${to} for order ${orderId}.`);
      return { status: "already_sent" };
    }

    // Fetch order_number for human-readable display
    const supabaseAdmin = getSupabaseAdmin();
    const { data: orderRow } = await supabaseAdmin
      .from("orders")
      .select("order_number")
      .eq("id", orderId)
      .maybeSingle();
    const orderCode = orderRow?.order_number || orderId.slice(0, 8).toUpperCase();

    // 2. Render HTML Email
    const { renderToStaticMarkup } = await import("react-dom/server");
    const emailHtml = renderToStaticMarkup(
      <OrderDeliveredEmail
        customerName={name}
        orderCode={orderCode}
        deliveredDate={deliveryData.deliveredDate}
        items={deliveryData.items}
      />,
    );

    // 3. Dispatch
    return await sendEmailDirect(to, "Your Drapeva Order has been Delivered ❤️", emailHtml);
  } catch (err) {
    console.error(`[Email Service] sendOrderDeliveredEmail failed for ${to}:`, err);
    return null;
  }
}

export async function sendAdminOrderCancellationAlert(
  orderId: string,
  orderData: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    total: number;
  },
) {
  const adminEmail = "drapeva2026@gmail.com";
  console.log(`[Email Service] sendAdminOrderCancellationAlert: Order ${orderId}`);
  try {
    // 1. Prevent duplicate email sending
    const alreadySent = await markEmailAsSent(
      orderId,
      "admin_cancellation_alert",
      "sendAdminOrderCancellationAlert",
    );
    if (alreadySent) {
      console.log(`[Email Service] Admin cancellation alert already sent for order ${orderId}.`);
      return { status: "already_sent" };
    }

    // 2. Render HTML Email
    const emailHtml = `
      <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf9f6; color: #1a1612; border: 1px solid #e2dcd0;">
        <h1 style="text-align: center; letter-spacing: 0.15em; font-weight: 400; text-transform: uppercase;">DRAPEVA</h1>
        <p style="text-align: center; font-size: 0.75rem; letter-spacing: 0.25em; text-transform: uppercase; color: #8c7853; margin-top: -10px;">Curated Heritage</p>
        <hr style="border: 0; border-top: 1px solid #e2dcd0; margin: 30px 0;" />
        <h2 style="text-align: center; font-weight: 400; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.1em;">Order Cancelled by Customer</h2>
        <p>An order has been cancelled by the customer. Below are the details:</p>
        <table width="100%" style="border-collapse: collapse; margin-top: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2dcd0; font-weight: bold; width: 150px;">Order Number:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2dcd0;">${orderData.orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2dcd0; font-weight: bold;">Customer Name:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2dcd0;">${orderData.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2dcd0; font-weight: bold;">Customer Email:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2dcd0;">${orderData.customerEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2dcd0; font-weight: bold;">Total Amount:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2dcd0; color: #8c7853; font-weight: bold;">₹${orderData.total.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2dcd0; font-weight: bold;">Cancelled At:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2dcd0;">${new Date().toLocaleString("en-IN")}</td>
          </tr>
        </table>
        <p style="margin-top: 30px; font-size: 13px; color: #78716c;">
          Please review the order details in your admin dashboard.
        </p>
      </div>
    `;

    // 3. Dispatch
    return await sendEmailDirect(
      adminEmail,
      `ALERT: Order #${orderData.orderNumber} Cancelled by Customer`,
      emailHtml,
    );
  } catch (err) {
    console.error(
      `[Email Service] sendAdminOrderCancellationAlert failed for order ${orderId}:`,
      err,
    );
    return null;
  }
}

// ------------------------------------------------------------
// Legacy backward compatibility wrapper class
// ------------------------------------------------------------
export class EmailService {
  static async sendEmail(to: string, subject: string, html: string) {
    return await sendEmailDirect(to, subject, html);
  }

  static async sendOrderConfirmation(
    to: string,
    name: string,
    orderId: string,
    orderData: {
      items: any[];
      subtotal: number;
      tax: number;
      shippingCost: number;
      discount: number;
      total: number;
      shippingAddress: any;
      paymentMethod: string;
    },
  ) {
    return await sendOrderConfirmationToCustomer(to, name, orderId, orderData);
  }

  static async sendAdminNotification(
    orderId: string,
    orderData: {
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      items: any[];
      total: number;
      shippingAddress: any;
      paymentMethod: string;
      paymentStatus: string;
      createdAt: string;
    },
  ) {
    return await sendAdminOrderNotification(orderId, orderData);
  }

  static async sendOrderShipped(
    to: string,
    name: string,
    orderId: string,
    shippingData: {
      courierName: string;
      trackingNumber: string;
      trackingUrl?: string;
      estimatedDelivery?: string;
      items: any[];
    },
  ) {
    return await sendOrderShippedEmail(to, name, orderId, shippingData);
  }

  static async sendOrderDelivered(
    to: string,
    name: string,
    orderId: string,
    deliveryData: {
      deliveredDate: string;
      items: any[];
    },
  ) {
    return await sendOrderDeliveredEmail(to, name, orderId, deliveryData);
  }

  static async sendOrderCancellationAlert(
    orderId: string,
    orderData: {
      customerName: string;
      customerEmail: string;
      orderNumber: string;
      total: number;
    },
  ) {
    return await sendAdminOrderCancellationAlert(orderId, orderData);
  }
}
