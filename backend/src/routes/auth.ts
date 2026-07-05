/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import env from "../config/env.js";
import { EmailService } from "../services/email.js";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/auth.js";
import { supabase } from "../services/supabase.js";
import { TotpService } from "../utils/totp.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error(
    "Critical security keys JWT_SECRET or JWT_REFRESH_SECRET are missing from the environment",
  );
}

import { CommonSchemas } from "../utils/schemas.js";

// Validation Schemas
const RegisterSchema = z.object({
  email: CommonSchemas.email,
  password: z.string().min(6),
  name: CommonSchemas.name,
  phone: CommonSchemas.phone,
});

const LoginSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});

// Helper to generate tokens
function generateTokens(user: { id: string; email: string; role: "CUSTOMER" | "ADMIN" }) {
  const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET!, {
    expiresIn: "15m",
    audience: "drapeva-app",
    issuer: "drapeva-api",
  });
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
      audience: "drapeva-app",
      issuer: "drapeva-api",
    },
  );
  return { accessToken, refreshToken };
}

// 1. Register Customer
router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = RegisterSchema.parse(req.body);

    const { data: existingEmail } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();

    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const formattedPhone = data.phone.startsWith("+")
      ? data.phone
      : `+91${data.phone.replace(/\D/g, "")}`;

    const { data: existingPhone } = await supabase
      .from("profiles")
      .select("id")
      .eq("phone", formattedPhone)
      .maybeSingle();

    if (existingPhone) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email: data.email,
      phone: formattedPhone,
      password: data.password,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        name: data.name,
        phone: formattedPhone,
      },
    });

    if (signUpError || !authData?.user) {
      return res.status(400).json({ error: signUpError?.message || "Sign up failed in Supabase" });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        phone: formattedPhone,
        role: "customer",
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    // Send Welcome Email
    await EmailService.sendWelcomeEmail(profile.email, profile.name);

    // Write Audit Log
    await supabase.from("AuditLog").insert({
      userId: profile.id,
      action: "USER_REGISTER",
      details: `Registered email: ${profile.email}`,
    });

    const userObj = {
      id: profile.id,
      email: profile.email || "",
      name: profile.name || "",
      role: (profile.role || "customer").toUpperCase() as "CUSTOMER" | "ADMIN",
    };

    const tokens = generateTokens(userObj);
    res.status(201).json({
      user: userObj,
      ...tokens,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    next(err);
  }
});

// 2. Login User
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = LoginSchema.parse(req.body);

    const isEmail = data.identifier.includes("@");
    const credentials: any = { password: data.password };
    const formatted = data.identifier.startsWith("+")
      ? data.identifier
      : `+91${data.identifier.replace(/\D/g, "")}`;

    if (isEmail) {
      credentials.email = data.identifier;
    } else {
      credentials.phone = formatted;
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword(credentials);
    const authUser = signInData?.user;

    if (signInError || !authUser) {
      return res.status(400).json({ error: signInError?.message || "Invalid credentials" });
    }

    let { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (!profile) {
      const passwordHash = await bcrypt.hash(data.password, 10);
      const { data: newProfile, error: profileErr } = await supabase
        .from("profiles")
        .insert({
          id: authUser.id,
          email: authUser.email || `user_${Date.now()}@drapeva.com`,
          name: authUser.user_metadata?.name || "Patron",
          phone: authUser.user_metadata?.phone || formatted,
          role: "customer",
          password_hash: passwordHash,
        })
        .select()
        .single();

      if (profileErr) {
        return res.status(500).json({ error: profileErr.message });
      }
      profile = newProfile;
    }

    // 2FA Verification if enabled
    if (profile.two_factor_enabled) {
      const { twoFactorCode } = req.body;
      if (!twoFactorCode) {
        return res.json({ require2FA: true, userId: profile.id });
      }
      if (!profile.two_factor_secret || !TotpService.verifyToken(profile.two_factor_secret, twoFactorCode)) {
        return res.status(400).json({ error: "Invalid two-factor authentication code" });
      }
    }

    // Write Session Log
    const { data: session, error: sessionErr } = await supabase
      .from("UserSession")
      .insert({
        userId: profile.id,
        ipAddress: req.ip || req.socket.remoteAddress || null,
        userAgent: (req.headers["user-agent"] as string) || null,
      })
      .select()
      .single();

    if (sessionErr) {
      return res.status(500).json({ error: sessionErr.message });
    }

    // Write Audit Log
    await supabase.from("AuditLog").insert({
      userId: profile.id,
      action: "USER_LOGIN",
      details: `Logged in user: ${profile.email} (Session ID: ${session.id})`,
    });

    const userObj = {
      id: profile.id,
      email: profile.email || "",
      name: profile.name || "",
      role: (profile.role || "customer").toUpperCase() as "CUSTOMER" | "ADMIN",
    };

    const tokens = generateTokens(userObj);
    res.json({
      user: userObj,
      sessionId: session.id,
      ...tokens,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    next(err);
  }
});

// 3. Refresh Access Token
router.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  jwt.verify(
    refreshToken,
    JWT_REFRESH_SECRET!,
    { audience: "drapeva-app", issuer: "drapeva-api" },
    (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }

      const user = decoded as { id: string; email: string; role: "CUSTOMER" | "ADMIN" };
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET!,
        {
          expiresIn: "15m",
          audience: "drapeva-app",
          issuer: "drapeva-api",
        },
      );

      res.json({ accessToken });
    },
  );
});

// 4. Request Forgot Password
router.post("/forgot-password", async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const { data: user } = await supabase
      .from("profiles")
      .select("id, email, password_hash, name")
      .eq("email", email)
      .maybeSingle();

    if (user) {
      const secret = JWT_SECRET! + (user.password_hash || "");
      const resetToken = jwt.sign({ id: user.id }, secret, {
        expiresIn: "1h",
        audience: "drapeva-app",
        issuer: "drapeva-api",
      });
      const resetLink = `${env.FRONTEND_URL}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

      await EmailService.sendEmail(
        email,
        "Reset Your Password - Drapeva",
        `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
      );
    }
    res.json({ message: "Password reset instructions sent if email exists" });
  } catch (err) {
    next(err);
  }
});

// 5. Reset Password
router.post("/reset-password", async (req: Request, res: Response, _next: NextFunction) => {
  const { token, password, email } = req.body;
  if (!token || !password || !email)
    return res.status(400).json({ error: "Token, email, and password are required" });

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }

  try {
    const { data: user } = await supabase
      .from("profiles")
      .select("id, email, password_hash")
      .eq("email", email)
      .maybeSingle();

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const secret = JWT_SECRET! + (user.password_hash || "");
    const decoded = jwt.verify(token, secret, {
      audience: "drapeva-app",
      issuer: "drapeva-api",
    }) as { id: string };

    if (decoded.id !== user.id) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await supabase
      .from("profiles")
      .update({ password_hash: passwordHash })
      .eq("id", user.id);

    res.json({ message: "Password reset successful" });
  } catch (_err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

// 6. Verify Email
router.post("/verify-email", async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token is required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET!, {
      audience: "drapeva-app",
      issuer: "drapeva-api",
    }) as { id: string };

    await supabase.from("AuditLog").insert({
      userId: decoded.id,
      action: "EMAIL_VERIFY",
      details: `Verified email successfully`,
    });
    res.json({ message: "Email verification successful" });
  } catch (_err) {
    res.status(400).json({ error: "Invalid or expired verification token" });
  }
});

// 8. Fetch current user profile details
router.get(
  "/me",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, email, name, phone, role, created_at")
        .eq("id", req.user!.id)
        .maybeSingle();

      if (!profile || error) {
        return res.status(404).json({ error: "Profile not found" });
      }

      const user = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        phone: profile.phone,
        role: (profile.role || "customer").toUpperCase() as "CUSTOMER" | "ADMIN",
        createdAt: profile.created_at,
      };

      res.json({ user });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
