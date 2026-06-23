import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'member';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      validated?: {
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export {};
