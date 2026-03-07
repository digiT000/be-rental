import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
        role: 'user' | 'admin' | 'super_admin';
      };
      refreshToken?: string;
    }
  }
}

export interface AuthJwtPayload extends JwtPayload {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
}
