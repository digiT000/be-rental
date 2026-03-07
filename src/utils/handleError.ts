import { Request, Response, NextFunction } from 'express';

interface AppErrorType extends Error {
  statusCode?: number;
}

interface PostgresError extends Error {
  code?: string;
  detail?: string;
}

type ErrorType = AppErrorType | PostgresError;

export default function handleError(
  error: ErrorType,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  const statusCode = 'statusCode' in error ? error.statusCode || 500 : 500;
  let message = error.message || 'Internal Server Error';
  let customStatusCode = statusCode;

  // Handle PostgreSQL duplicate key error
  if ('code' in error && error.code === '23505') {
    const match = 'detail' in error ? error.detail?.match(/Key \(([^)]+)\)/) : null;
    const field = match ? match[1] : 'field';

    customStatusCode = 409;
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;

    return res.status(customStatusCode).json({
      success: false,
      message: message,
      error: 'Duplicate entry',
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    customStatusCode = 401;
    message = 'Invalid token. Please login again';

    return res.status(customStatusCode).json({
      success: false,
      message: message,
      error: 'Authentication failed',
    });
  }

  if (error.name === 'TokenExpiredError') {
    customStatusCode = 401;
    message = 'Token expired. Please login again';

    return res.status(customStatusCode).json({
      success: false,
      message: message,
      error: 'Token expired',
    });
  }

  if (error.name === 'NotBeforeError') {
    customStatusCode = 401;
    message = 'Token not yet valid';

    return res.status(customStatusCode).json({
      success: false,
      message: message,
      error: 'Invalid token',
    });
  }

  return res.status(customStatusCode).json({
    message: error.message,
  });
}
