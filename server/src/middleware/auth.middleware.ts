import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest } from '../types';

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret) as {
      userId: string;
      email: string;
    };
    req.user = { userId: payload.userId, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
  }
}
