import { z } from "zod";

// Shared common/reusable validation schemas for input sanitization & validations
export const CommonSchemas = {
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
};
