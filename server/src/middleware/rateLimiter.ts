import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: 'Too Many Requests',
    message: 'Too many attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    error: 'Too Many Requests',
    message: 'Too many AI requests, please slow down',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const authReq = req as { user?: { userId: string } };
    return authReq.user?.userId || 'anonymous_user';
  },
});

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
