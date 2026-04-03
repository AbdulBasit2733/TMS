import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No access token" });
  }

  try {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "JWT_ACCESS_SECRET not configured" });
    }

    const decoded = jwt.verify(token, secret);
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded)
    ) {
      return res.status(401).json({ error: "Unauthorized: Invalid token payload" });
    }

    req.userId = (decoded as { userId: string }).userId;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};