import { Router, Response, NextFunction } from "express";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/auth.js";
import { TotpService } from "../utils/totp.js";
import { supabase } from "../services/supabase.js";

const router = Router();

// 1. Setup 2FA
router.post(
  "/2fa/setup",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { data: user, error: userErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", req.user!.id)
        .maybeSingle();

      if (!user || userErr) return res.status(404).json({ error: "User not found" });

      // Generate secret and store temporarily
      const secret = TotpService.generateSecret();
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ two_factor_secret: secret })
        .eq("id", user.id);

      if (updateErr) {
        return res.status(500).json({ error: updateErr.message });
      }

      const qrUrl = TotpService.getOtpauthUrl(user.email || "", secret);
      res.json({ secret, qrUrl });
    } catch (err) {
      next(err);
    }
  },
);

// 2. Verify and Enable 2FA
router.post(
  "/2fa/verify",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Verification code is required" });

    try {
      const { data: user, error: userErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", req.user!.id)
        .maybeSingle();

      if (!user || userErr || !user.two_factor_secret) {
        return res.status(400).json({ error: "2FA setup has not been initiated" });
      }

      const isValid = TotpService.verifyToken(user.two_factor_secret, code);
      if (!isValid) {
        return res.status(400).json({ error: "Invalid verification code" });
      }

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ two_factor_enabled: true })
        .eq("id", user.id);

      if (updateErr) {
        return res.status(500).json({ error: updateErr.message });
      }

      res.json({ success: true, message: "Two-factor authentication enabled successfully" });
    } catch (err) {
      next(err);
    }
  },
);

// 3. List Sessions
router.get(
  "/sessions",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { data: sessions, error } = await supabase
        .from("UserSession")
        .select("*")
        .eq("userId", req.user!.id)
        .eq("isActive", true)
        .order("createdAt", { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json(sessions);
    } catch (err) {
      next(err);
    }
  },
);

// 4. Force Logout other sessions
router.post(
  "/sessions/logout-other",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { currentSessionId } = req.body;
    try {
      const { error } = await supabase
        .from("UserSession")
        .update({ isActive: false })
        .eq("userId", req.user!.id)
        .neq("id", currentSessionId || "")
        .eq("isActive", true);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ success: true, message: "Logged out from all other sessions" });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
