import AuthService from "../service/auth.service.js";
import { UnauthorizedError } from "../utils/appError.js";

export default class AuthController {
  authService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res, next) {
    const { email, password } = req.body;

    const user = await this.authService.userLogin(email, password);

    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true, // Prevents JavaScript from accessing the cookie (XSS protection)
      secure: true, // Ensures the cookie is only sent over HTTPS
      sameSite: "Strict", // Helps protect against CSRF attacks
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    return res.status(200).json({
      ...user,
      refreshToken: null,
    });
  }

  // Register

  async register(req, res, next) {
    const { name, email, password } = req.body;

    const createdUser = await this.authService.createUser(
      name,
      email,
      password
    );

    return res.status(201).json({
      user: {
        id: createdUser.id,
        name,
        email,
      },
      message: "User created ",
    });
  }

  async getNewAccessToken(req, res, next) {
    const token = req.refreshToken;

    if (!token) {
      throw new UnauthorizedError(
        "Refresh token not found. Please login again"
      );
    }

    try {
      const newToken = await this.authService.refreshAccessToken(token);

      res.status(200).send({
        token: newToken,
      });
    } catch (error) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      throw error;
    }
  }

  // Get Token
}
