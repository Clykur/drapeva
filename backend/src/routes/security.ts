import { Router, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/auth.js";
import { TotpService } from "../utils/totp.js";

const router = Router();

// 1. Setup 2FA
router.post(
  "/2fa/setup",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
      if (!user) return res.status(404).json({ error: "User not found" });

      // Generate secret and store temporarily
      const secret = TotpService.generateSecret();
      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorSecret: secret },
      });

      const qrUrl = TotpService.getOtpauthUrl(user.email, secret);
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
      const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
      if (!user || !user.twoFactorSecret) {
        return res.status(400).json({ error: "2FA setup has not been initiated" });
      }

      const isValid = TotpService.verifyToken(user.twoFactorSecret, code);
      if (!isValid) {
        return res.status(400).json({ error: "Invalid verification code" });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorEnabled: true },
      });

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
      const sessions = await prisma.userSession.findMany({
        where: { userId: req.user!.id, isActive: true },
        orderBy: { createdAt: "desc" },
      });
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
      await prisma.userSession.updateMany({
        where: {
          userId: req.user!.id,
          id: { not: currentSessionId || "" },
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      res.json({ success: true, message: "Logged out from all other sessions" });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
