/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticateJWT, requireRole } from "../middlewares/auth.js";
import { EmailService } from "../services/email.js";
import { CommonSchemas } from "../utils/schemas.js";
import { supabase } from "../services/supabase.js";

const router = Router();

const AppointmentSchema = z.object({
  name: CommonSchemas.name,
  email: CommonSchemas.email,
  phone: CommonSchemas.phone,
  date: z.string(), // ISO string
  timeSlot: z.string(),
  type: z.enum(["IN_PERSON", "VIDEO"]),
  notes: z.string().optional(),
});

function mapAppointment(a: any) {
  if (!a) return a;
  return {
    id: a.id,
    userId: a.user_id,
    name: a.name,
    email: a.email,
    phone: a.phone,
    date: a.date,
    timeSlot: a.time_slot,
    type: a.type,
    status: a.status,
    notes: a.notes,
    createdAt: a.created_at,
  };
}

// 1. Create Appointment
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = AppointmentSchema.parse(req.body);

    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: new Date(data.date).toISOString(),
        time_slot: data.timeSlot,
        type: data.type,
        notes: data.notes,
        status: "PENDING",
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const dateStr = new Date(data.date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    await EmailService.sendAppointmentConfirmation(
      data.email,
      data.name,
      dateStr,
      data.timeSlot,
      data.type,
    );

    res.status(201).json(mapAppointment(appointment));
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    next(err);
  }
});

// 2. Retrieve Appointments (Admin Only)
router.get(
  "/",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json(appointments.map(mapAppointment));
    } catch (err) {
      next(err);
    }
  },
);

// 3. Update Appointment Status (Admin Only)
router.put(
  "/:id",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const { data: appointment, error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error || !appointment) {
        return res.status(500).json({ error: error?.message || "Failed to update appointment" });
      }

      const dateStr = new Date(appointment.date).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      await EmailService.sendEmail(
        appointment.email,
        `Your Drapeva Consultation Status Updated`,
        `<p>Dear ${appointment.name},</p><p>The status of your appointment on ${dateStr} at ${appointment.time_slot} has been updated to: <strong>${status}</strong>.</p>`,
      );

      res.json(mapAppointment(appointment));
    } catch (err) {
      next(err);
    }
  },
);

export default router;
