import { Request, Response } from 'express';
import AuthService from '../service/auth.service.js';
import { UnauthorizedError } from '../utils/appError.js';

export default class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    const user = await this.authService.userLogin(email, password);

    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true, // Prevents JavaScript from accessing the cookie (XSS protection)
      secure: true, // Ensures the cookie is only sent over HTTPS
      sameSite: 'strict', // Helps protect against CSRF attacks
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    return res.status(200).json({
      ...user,
      refreshToken: null,
    });
  };

  register = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password, intenalRoleOnly = 'user' } = req.body;

    const createdUser = await this.authService.createUser(
      name,
      email,
      password,
      intenalRoleOnly
    );

    return res.status(201).json({
      user: {
        id: createdUser.id,
        name,
        email,
      },
      message: 'User created ',
    });
  };

  getNewAccessToken = async (req: Request, res: Response): Promise<Response> => {
    const token = req.refreshToken;

    if (!token) {
      throw new UnauthorizedError('Refresh token not found. Please login again');
    }

    try {
      const newToken = await this.authService.refreshAccessToken(token);

      return res.status(200).send({
        token: newToken,
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
