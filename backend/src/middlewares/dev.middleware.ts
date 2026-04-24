import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

/**
 * DEV ONLY — simulates an authenticated user with a fixed UUID.
 * Replace with authMiddleware once authentication is implemented.
 */
export function devMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void {
  req.userId = 'a0000000-0000-0000-0000-000000000001';
  next();
}
