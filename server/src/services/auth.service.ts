import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { User, IUser } from '../models/User';
import { env } from '../config/env';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.service';
import { ApiError } from '../types';

function createApiError(message: string, statusCode: number): ApiError {
  const error: ApiError = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function generateAccessToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, env.jwtSecret, { expiresIn: '15m' });
}

function generateRefreshToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, env.jwtRefreshSecret, { expiresIn: '7d' });
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<IUser> {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw createApiError('An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const verificationToken = randomUUID();

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    verificationToken,
    isVerified: false,
  });

  await sendVerificationEmail(user.email, user.name, verificationToken);

  return user;
}

export async function verifyEmail(token: string): Promise<void> {
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    throw createApiError('Invalid or expired verification token', 400);
  }

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string; user: Partial<IUser> }> {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw createApiError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw createApiError('Invalid email or password', 401);
  }

  if (!user.isVerified) {
    throw createApiError('Please verify your email address before logging in', 403);
  }

  const accessToken = generateAccessToken(user._id.toString(), user.email);
  const refreshToken = generateRefreshToken(user._id.toString(), user.email);

  return {
    accessToken,
    refreshToken,
    user: { _id: user._id, name: user.name, email: user.email },
  };
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string }> {
  try {
    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as {
      userId: string;
      email: string;
    };

    const user = await User.findById(payload.userId);
    if (!user || !user.isVerified) {
      throw createApiError('Unauthorized', 401);
    }

    const accessToken = generateAccessToken(payload.userId, payload.email);
    return { accessToken };
  } catch {
    throw createApiError('Invalid or expired refresh token', 401);
  }
}

export async function initiatePasswordReset(email: string): Promise<void> {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return;
  }

  const resetToken = randomUUID();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  await sendPasswordResetEmail(user.email, user.name, resetToken);
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw createApiError('Invalid or expired reset token', 400);
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
}

export async function getUserById(userId: string): Promise<Partial<IUser>> {
  const user = await User.findById(userId).select('-passwordHash -verificationToken -resetPasswordToken -resetPasswordExpires');
  if (!user) {
    throw createApiError('User not found', 404);
  }
  return user;
}
