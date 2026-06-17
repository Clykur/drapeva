import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../config/prisma.js";
import { authenticateJWT, requireRole, AuthenticatedRequest } from "../middlewares/auth.js";
import { EmailService } from "../services/email.js";
import { WhatsAppService } from "../services/whatsapp.js";

const router = Router();

const AppointmentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  date: z.string(), // ISO string
  timeSlot: z.string(),
  type: z.enum(["IN_PERSON", "VIDEO"]),
  notes: z.string().optional(),
});

// 1. Create Appointment
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = AppointmentSchema.parse(req.body);

    const appointment = await prisma.appointment.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: new Date(data.date),
        timeSlot: data.timeSlot,
        type: data.type,
        notes: data.notes,
        status: "PENDING",
      },
    });

    const dateStr = new Date(data.date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Send Confirmations
    await EmailService.sendAppointmentConfirmation(
      data.email,
      data.name,
      dateStr,
      data.timeSlot,
      data.type,
    );
    await WhatsAppService.sendAppointmentReminder(data.phone, data.name, dateStr, data.timeSlot);

    res.status(201).json(appointment);
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
      const appointments = await prisma.appointment.findMany({
        orderBy: { date: "asc" },
      });
      res.json(appointments);
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
      const appointment = await prisma.appointment.update({
        where: { id },
        data: { status },
      });

      // Send Status Update Email
      const dateStr = appointment.date.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      await EmailService.sendEmail(
        appointment.email,
        `Your Maaya Couture Consultation Status Updated`,
        `<p>Dear ${appointment.name},</p><p>The status of your appointment on ${dateStr} at ${appointment.timeSlot} has been updated to: <strong>${status}</strong>.</p>`,
      );

      res.json(appointment);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
