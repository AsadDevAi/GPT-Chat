import { Request, Response, NextFunction } from 'express';
import {
  registerUser,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  initiatePasswordReset,
  resetPassword,
  getUserById,
} from '../services/auth.service';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';
import { AuthRequest } from '../types';
import { env } from '../config/env';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = registerSchema.parse(req.body);
    await registerUser(body.name, body.email, body.password);
    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmailHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = verifyEmailSchema.parse(req.body);
    await verifyEmail(token);
    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = loginSchema.parse(req.body);
    const { accessToken, refreshToken, user } = await loginUser(
      body.email,
      body.password
    );

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json({ accessToken, user });
  } catch (err) {
    next(err);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      res.status(401).json({ error: 'Unauthorized', message: 'No refresh token' });
      return;
    }

    const { accessToken } = await refreshAccessToken(token);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(
  _req: Request,
  res: Response
): Promise<void> {
  res.clearCookie('refreshToken', { path: '/' });
  res.json({ message: 'Logged out successfully' });
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    await initiatePasswordReset(email);
    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);
    await resetPassword(token, password);
    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
}

export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getUserById(req.user!.userId);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
