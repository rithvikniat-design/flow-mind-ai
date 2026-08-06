import { Request, Response, NextFunction } from 'express';

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 500; // limit each IP to 500 requests per window

interface RequestRecord {
  count: number;
  resetTime: number;
}

const ipCache: Record<string, RequestRecord> = {};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  if (!ipCache[ip] || now > ipCache[ip].resetTime) {
    ipCache[ip] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    return next();
  }

  ipCache[ip].count++;

  if (ipCache[ip].count > MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests. Please try again after 15 minutes.',
    });
  }

  next();
};
