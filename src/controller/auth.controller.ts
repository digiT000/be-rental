import { Request, Response } from 'express';
import AuthService from '../service/auth.service.js';
import { UnauthorizedError } from '../utils/appError.js';
import {
  LoginRequestDTO,
  RegisterRequestDTO,
  RefreshTokenResponseDTO,
} from '../dto/auth/index.js';

export default class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response): Promise<Response> => {
    // Type-safe request body using DTO
    const { email, password } = req.body as LoginRequestDTO;

    const user = await this.authService.userLogin(email, password);

    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true, // Prevents JavaScript from accessing the cookie (XSS protection)
      secure: true, // Ensures the cookie is only sent over HTTPS
      sameSite: 'strict', // Helps protect against CSRF attacks
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    // Return LoginResponseDTO (without refreshToken)
    return res.status(200).json({
      user: user.user,
      accessToken: user.accessToken,
      // refreshToken excluded from response body (sent as cookie)
    });
  };

  register = async (req: Request, res: Response): Promise<Response> => {
    // Type-safe request body using DTO
    const { name, email, password, intenalRoleOnly = 'user' } = req.body as RegisterRequestDTO;

    const createdUser = await this.authService.createUser(
      name,
      email,
      password,
      intenalRoleOnly
    );

    // Return UserResponseDTO (already formatted by service)
    return res.status(201).json({
      user: createdUser,
      message: 'User created successfully',
    });
  };

  getNewAccessToken = async (req: Request, res: Response): Promise<Response> => {
    const token = req.refreshToken;

    if (!token) {
      throw new UnauthorizedError('Refresh token not found. Please login again');
    }

    try {
      const newToken = await this.authService.refreshAccessToken(token);

      // Return RefreshTokenResponseDTO
      const response: RefreshTokenResponseDTO = {
        token: newToken,
      };

      return res.status(200).json(response);
    } catch (error) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      throw error;
    }
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    try {
      const refreshToken = req.refreshToken;
      const user = req.user;

      if (!refreshToken) {
        throw new UnauthorizedError('Refresh token not found. Please login again');
      }

      if (!user) {
        throw new UnauthorizedError('User not found. Please login again');
      }

      await this.authService.userLogout(user.id, refreshToken);
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      return res.status(200).json({
        message: 'User logout',
      });
    } catch (error) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      throw error;
    }
  };
}
