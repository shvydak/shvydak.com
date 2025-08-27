import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/types';

/**
 * Custom error handler middleware
 * Handles different types of errors and sends appropriate responses
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle custom AppError
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Handle Mongoose validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
    message = validationErrors.join(', ');
  }
  // Handle Mongoose duplicate key errors
  else if (error.name === 'MongoError' && (error as any).code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  // Handle Cast errors (invalid ObjectId)
  else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Log error details
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env['NODE_ENV'] === 'development' && {
      stack: error.stack,
      details: error.message
    })
  });
};

/**
 * 404 Not Found handler
 * Should be placed after all routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors and pass them to error handler
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
