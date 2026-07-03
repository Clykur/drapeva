import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is missing");
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "CUSTOMER" | "ADMIN";
  };
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers?.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      JWT_SECRET!,
      { audience: "drapeva-app", issuer: "drapeva-api" },
      (err, decoded) => {
        if (err || !decoded) {
          return res.status(403).json({ error: "Invalid or expired token" });
        }

        req.user = decoded as { id: string; email: string; role: "CUSTOMER" | "ADMIN" };
        next();
      },
    );
  } else {
    res.status(401).json({ error: "Authorization token required" });
  }
}

export function requireRole(roles: ("CUSTOMER" | "ADMIN")[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied: insufficient permissions" });
    }

    next();
  };
}
