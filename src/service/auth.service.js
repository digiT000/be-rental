import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UnauthorizedError } from "../utils/appError.js";
import { UserModel } from "../models/user.js";
import { LOGOUT_REASON } from "../utils/constant.js";

export default class AuthService {
  userModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async createUser(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const result = await this.userModel.create(name, email, hashedPassword);
      return result;
    } catch (error) {
      if (error.code === "23505") {
        throw new UnauthorizedError("User already exist with this email");
      }
      throw error;
    }
  }

  async userLogin(email, password) {
    try {
      const user = await this.userModel.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedError("Invalid Email or password");
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        throw new UnauthorizedError("Invalid Password");
      }

      // Generate Refresh Token
      const tokenValidUntil = new Date();
      tokenValidUntil.setDate(tokenValidUntil.getDate() + 15); // Add 15 days
      const refreshToken = this.generateRefreshToken();
      await this.userModel.saveRefreshToken(
        user.id,
        refreshToken,
        tokenValidUntil
      );

      const accessToken = this.getAccessToken(user);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        refreshToken,
        accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY
      );

      const user = await this.userModel.verifyRefreshToken(
        decodedToken.id,
        refreshToken
      );

      if (!user) {
        throw new UnauthorizedError("Invalid refresh token");
      }

      if (user.revoked) {
        throw new UnauthorizedError(
          "Your access already revoke, please login again"
        );
      }

      // Check if token is expired
      const now = new Date();
      const validUntil = new Date(user.refresh_token_valid_until);

      if (now > validUntil) {
        throw new UnauthorizedError("expired refresh token");
      }

      const accessToken = this.getAccessToken(user);

      return accessToken;
    } catch (error) {
      throw error;
    }
  }

  async userLogout(userId, refreshToken) {
    try {
      return await this.userModel.userRevoke(
        userId,
        refreshToken,
        LOGOUT_REASON.logout
      );
    } catch (error) {
      throw error;
    }
  }

  // @param
  getAccessToken(user) {
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: "30m",
      }
    );
    return accessToken;
  }

  generateRefreshToken() {
    // Generate 32 random bytes and convert to URL-safe base64 string
    return crypto.randomBytes(32).toString("base64url");
  }
}
