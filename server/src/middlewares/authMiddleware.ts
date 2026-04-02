import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: Missing token' });

  try {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'JWT_ACCESS_SECRET is not configured' });
      return;
    }

    const decoded = jwt.verify(token, secret);
    if (typeof decoded !== 'object' || decoded === null || !('userId' in decoded)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
    }

    req.userId = (decoded as { userId: string }).userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};
