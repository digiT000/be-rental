import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UnauthorizedError } from '../utils/appError.js';
import { UserModel } from '../models/user.js';
import { LOGOUT_REASON } from '../types/constants.js';
import { env } from '../config/env.js';
import { UserResponseDTO, toUserResponse } from '../dto/auth/index.js';

/**
 * Internal response type for login (includes refreshToken)
 * Different from LoginResponseDTO which excludes refreshToken
 */
interface InternalLoginResponse {
  user: UserResponseDTO;
  refreshToken: string;
  accessToken: string;
}

export default class AuthService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    role: 'user' | 'admin' | 'super_admin' = 'user'
  ): Promise<UserResponseDTO> {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const result = await this.userModel.create(name, email, hashedPassword, role);
      return toUserResponse(result);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new UnauthorizedError('User already exist with this email');
      }
      throw error;
    }
  }

  async userLogin(email: string, password: string): Promise<InternalLoginResponse> {
    const user = await this.userModel.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Invalid Email or password');
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throw new UnauthorizedError('Invalid Password');
    }

    // Generate Refresh Token
    const tokenValidUntil = new Date();
    tokenValidUntil.setDate(tokenValidUntil.getDate() + 15); // Add 15 days
    const refreshToken = this.generateRefreshToken();
    await this.userModel.saveRefreshToken(user.id, refreshToken, tokenValidUntil);

    const accessToken = this.getAccessToken(user);

    // Convert user to DTO, excluding password
    const userDto = toUserResponse(user);

    return {
      user: userDto,
      refreshToken,
      accessToken,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const user = await this.userModel.verifyRefreshToken(refreshToken);
    console.log({ user });

    if (!user) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (user.revoked) {
      throw new UnauthorizedError('Your access already revoke, please login again');
    }

    // Check if token is expired
    const now = new Date();
    const validUntil = new Date(user.valid_until);

    if (now > validUntil) {
      throw new UnauthorizedError('expired refresh token');
    }

    const accessToken = this.getAccessToken(user);

    return accessToken;
  }

  async userLogout(userId: string, refreshToken: string): Promise<void> {
    return await this.userModel.userRevoke(userId, refreshToken, LOGOUT_REASON.USER_LOGOUT);
  }

  getAccessToken(user: { id: string; email: string; role?: string }): string {
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role || 'user',
      },
      env.ACCESS_TOKEN_SECRET_KEY,
      {
        algorithm: 'HS256',
        expiresIn: '30m',
      }
    );
    return accessToken;
  }

  generateRefreshToken(): string {
    // Generate 32 random bytes and convert to URL-safe base64 string
    return crypto.randomBytes(32).toString('base64url');
  }
}
