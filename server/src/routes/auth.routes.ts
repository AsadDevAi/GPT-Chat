import { Router } from 'express';
import {
  register,
  verifyEmailHandler,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPasswordHandler,
  getMe,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/verify-email', verifyEmailHandler);
router.post('/login', authRateLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', resetPasswordHandler);
router.get('/me', authenticate, getMe);

export default router;
