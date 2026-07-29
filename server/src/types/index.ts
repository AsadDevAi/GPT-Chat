import { Request } from 'express';
import { Types } from 'mongoose';

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface MessageRole {
  role: 'user' | 'assistant';
}

export interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ApiError extends Error {
  statusCode?: number;
}
