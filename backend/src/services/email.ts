import { logger } from "../utils/logger.js";
import env from "../config/env.js";

const apiKey = process.env.ZEPTOMAIL_API_KEY || "";
const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL || "bounce@pepisandbox.com";
const fromName = process.env.ZEPTOMAIL_FROM_NAME || "Drapeva";
const isMocked = !apiKey || apiKey.includes("mock");

export class EmailService {
  static async sendEmail(to: string, subject: string, html: string) {
    if (isMocked) {
      if (env.NODE_ENV === "production" || env.NODE_ENV === "staging") {
        throw new Error(
          "ZeptoMail API Key is missing or invalid in production/staging environment.",
        );
      }
      logger.info(`[Email Mock] Sending to: ${to}`, { subject });
      return { id: "zeptomail_mock_id_" + Math.random().toString(36).substring(4) };
    }

    // 1. Verify endpoint based on the account region (.in vs .com)
    const isIndia =
      fromEmail.toLowerCase().endsWith(".in") || fromEmail.toLowerCase().includes(".co.in");
    const endpoint = isIndia
      ? "https://api.zeptomail.in/v1.1/email"
      : "https://api.zeptomail.com/v1.1/email";

    // 2. Verify Authorization header format
    const authHeader = apiKey.startsWith("Zoho-enczapikey ") ? apiKey : `Zoho-enczapikey ${apiKey}`;

    // 3. Verify request body exactly matches the official specification
    const payload = {
      from: {
        address: fromEmail,
        name: fromName,
      },
      to: [
        {
          email_address: {
            address: to,
            name: to.split("@")[0],
          },
        },
      ],
      subject,
      htmlbody: html,
    };

    try {
      logger.debug(`[Email] Sending to: ${to}`, { subject, endpoint });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      let responseData: unknown;
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { text };
      }

      if (!response.ok) {
        logger.error(`[Email] API error: ${response.status}`, { to, subject });
        return null;
      }

      return responseData;
    } catch (err: unknown) {
      logger.error("[Email] Send failed", {
        message: err instanceof Error ? err.message : String(err),
      });
      return null;
    }
  }

  static async sendWelcomeEmail(to: string, name: string) {
    const html = `
      <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf9f6; color: #1a1612; border: 1px solid #e2dcd0;">
        <h1 style="text-align: center; letter-spacing: 0.15em; font-weight: 400; text-transform: uppercase;">DRAPEVA</h1>
        <p style="text-align: center; font-size: 0.75rem; letter-spacing: 0.25em; text-transform: uppercase; color: #8c7853; margin-top: -10px;">Curated Heritage</p>
        <hr style="border: 0; border-top: 1px solid #e2dcd0; margin: 30px 0;" />
        <p>Dear ${name},</p>
        <p>Welcome to the DRAPEVA STORE. Your account has been successfully registered.</p>
        <p>Discover our heirloom Banarasi weaves, bridal Kanjivarams, and styling consultations designed to celebrate your most precious moments.</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${env.FRONTEND_URL}/shop" style="background-color: #1a1612; color: #faf9f6; padding: 15px 30px; text-decoration: none; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase;">Explore the Collection</a>
        </div>
        <p style="font-size: 0.85rem; color: #8c7853; line-height: 1.6;">Warmest regards,<br/>The Drapeva Concierge Team</p>
      </div>
    `;
    return this.sendEmail(to, "Welcome to DRAPEVA STORE", html);
  }

  static async sendOrderConfirmation(to: string, name: string, orderId: string, total: number) {
    const html = `
      <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf9f6; color: #1a1612; border: 1px solid #e2dcd0;">
        <h1 style="text-align: center; letter-spacing: 0.15em; font-weight: 400; text-transform: uppercase;">DRAPEVA</h1>
        <p style="text-align: center; font-size: 0.75rem; letter-spacing: 0.25em; text-transform: uppercase; color: #8c7853; margin-top: -10px;">Curated Heritage</p>
        <hr style="border: 0; border-top: 1px solid #e2dcd0; margin: 30px 0;" />
        <p>Dear ${name},</p>
        <p>We are delighted to confirm receipt of your order <strong>#${orderId}</strong>.</p>
        <p>We have notified our trusted partner weavers and artisans, and they have begun preparing your curated premium saree. The estimated shipping and delivery duration is 3 to 6 weeks.</p>
        <p>Order Total: <strong>₹${total.toLocaleString("en-IN")}</strong></p>
        <p>You can track the progress of your piece at any time in your customer dashboard.</p>
        <p style="font-size: 0.85rem; color: #8c7853; line-height: 1.6;">With compliments,<br/>The Drapeva Concierge Team</p>
      </div>
    `;
    return this.sendEmail(to, `Order Confirmation #${orderId} — Drapeva`, html);
  }

  static async sendAppointmentConfirmation(
    to: string,
    name: string,
    dateStr: string,
    timeSlot: string,
    type: string,
  ) {
    const html = `
      <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf9f6; color: #1a1612; border: 1px solid #e2dcd0;">
        <h1 style="text-align: center; letter-spacing: 0.15em; font-weight: 400; text-transform: uppercase;">DRAPEVA</h1>
        <p style="text-align: center; font-size: 0.75rem; letter-spacing: 0.25em; text-transform: uppercase; color: #8c7853; margin-top: -10px;">Curated Heritage</p>
        <hr style="border: 0; border-top: 1px solid #e2dcd0; margin: 30px 0;" />
        <p>Dear ${name},</p>
        <p>Your bridal/couture consultation has been scheduled.</p>
        <p><strong>Date:</strong> ${dateStr}</p>
        <p><strong>Time Slot:</strong> ${timeSlot}</p>
        <p><strong>Type:</strong> ${type === "VIDEO" ? "Video Consultation" : "In-Person Consultation"}</p>
        <p>Our concierge will reach out to you shortly via email to share details or link invites.</p>
        <p style="font-size: 0.85rem; color: #8c7853; line-height: 1.6;">With compliments,<br/>The Drapeva Concierge Team</p>
      </div>
    `;
    return this.sendEmail(to, "Consultation Scheduled — Drapeva", html);
  }
}
