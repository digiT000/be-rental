import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: "user" | "admin" | "super_admin";
      };
      refreshToken?: string;
    }
  }
}

export interface AuthJwtPayload extends JwtPayload {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "super_admin";
}

export interface OptionPagination {
  page: number;
  limit: number;
}
