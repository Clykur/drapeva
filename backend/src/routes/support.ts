/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticateJWT, requireRole } from "../middlewares/auth.js";
import { EmailService } from "../services/email.js";
import { escapeHTML } from "../utils/sanitize.js";
import { CommonSchemas } from "../utils/schemas.js";
import { supabase } from "../services/supabase.js";

const router = Router();

const TicketSchema = z.object({
  name: CommonSchemas.name,
  email: CommonSchemas.email,
  subject: z.string().min(4),
  message: z.string().min(10),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

function mapTicket(t: any) {
  if (!t) return t;
  // Map priority: normal -> MEDIUM, urgent/high -> HIGH, low -> LOW
  let mappedPriority = "MEDIUM";
  if (t.priority === "low") mappedPriority = "LOW";
  else if (t.priority === "high" || t.priority === "urgent") mappedPriority = "HIGH";

  return {
    id: t.id,
    name: t.customer_name,
    email: t.customer_email,
    subject: t.subject,
    message: t.message || "",
    priority: mappedPriority,
    status: (t.status || "open").toUpperCase(),
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  };
}

// 1. Submit Support Ticket (Public/Auth)
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = TicketSchema.parse(req.body);
    let prio = "normal";
    if (data.priority === "LOW") prio = "low";
    else if (data.priority === "HIGH") prio = "high";

    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .insert({
        customer_name: escapeHTML(data.name),
        customer_email: data.email,
        subject: escapeHTML(data.subject),
        message: escapeHTML(data.message),
        priority: prio,
        status: "open",
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Notify Support Admin
    await EmailService.sendEmail(
      "drapeva2026@gmail.com",
      `New Support Ticket: ${data.subject}`,
      `<p>Received support ticket from ${data.name} (${data.email}):</p><p>Message: ${data.message}</p>`,
    );

    res.status(201).json(mapTicket(ticket));
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    next(err);
  }
});

// 2. Newsletter Subscription
router.post("/newsletter", async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const { data: subscriber, error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email,
          is_active: true,
        },
        {
          onConflict: "email",
        },
      )
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    await EmailService.sendEmail(
      email,
      "Welcome to the Drapeva Journal - Newsletter",
      `<h3>Welcome to Drapeva</h3><p>Thank you for subscribing to our weekly journal. You will receive updates on new collections and artisan stories.</p>`,
    );

    // Map back to camelCase naming style
    const mapped = {
      id: subscriber.id,
      email: subscriber.email,
      isActive: subscriber.is_active,
      createdAt: subscriber.created_at,
    };

    res.json({ message: "Subscription successful", subscriber: mapped });
  } catch (err) {
    next(err);
  }
});

// 3. View All Tickets (Admin Only)
router.get(
  "/tickets",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data: tickets, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json(tickets.map(mapTicket));
    } catch (err) {
      next(err);
    }
  },
);

// 4. Update Ticket Status (Admin Only)
router.put(
  "/tickets/:id",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const StatusSchema = z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]);
      const parsedStatus = StatusSchema.parse(status);

      const { data: ticket, error } = await supabase
        .from("support_tickets")
        .update({ status: parsedStatus.toLowerCase() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json(mapTicket(ticket));
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      next(err);
    }
  },
);

export default router;
