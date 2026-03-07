import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/appError.js';
import { env } from '../config/env.js';
import { AuthJwtPayload } from '../types/express.js';
import { UserRole } from '../types/constants.js';

export function authorizationMiddlware(roleAccess: UserRole = 'user') {
  return (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve().then(() => {
      const authHeader = req.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Access token not found. Please login again');
      }

      const accessToken = authHeader.split(' ')[1];

      // Verify access token here
      const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET_KEY) as AuthJwtPayload;

      if (roleAccess !== decoded.role) {
        throw new UnauthorizedError('You dont have access to this endpoint');
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      };

      next();
    });
  };
}

export function refreshTokenAuthorization(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  return Promise.resolve().then(() => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token not found. Please login again');
    }

    req.refreshToken = refreshToken;

    next();
  });
}
