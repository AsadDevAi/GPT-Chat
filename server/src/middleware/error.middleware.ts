import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { ApiError } from '../types';

export function errorHandler(
  err: ApiError | ZodError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const issues: ZodIssue[] = err.issues;
    res.status(400).json({
      error: 'Validation Error',
      message: issues[0].message,
      details: issues.map((e: ZodIssue) => ({ field: e.path.join('.'), message: e.message })),
    });
    return;
  }

  const statusCode = (err as ApiError).statusCode || 500;
  const message =
    statusCode === 500 ? 'Internal server error' : err.message;

  if (statusCode === 500) {
    console.error('[ERROR]', err);
  }

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : 'Error',
    message,
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
}
