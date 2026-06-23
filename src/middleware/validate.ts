import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';

type RequestTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: RequestTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.') || target,
        message: err.message,
      }));
      return next(new AppError('Validation failed', 400, errors));
    }

    // Express 5: req.query and req.params are read-only
    if (target === 'body') {
      req.body = result.data;
    } else {
      req.validated ??= {};
      req.validated[target] = result.data;
    }
    next();
  };
}
