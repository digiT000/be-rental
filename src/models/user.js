import db from "../config/postgres.js";
import crypto from "crypto";

export class UserModel {
  async create(name, email, hashedPassword) {
    try {
      const values = [name, email, hashedPassword];

      const query = `
          INSERT INTO users (name, email, password)
          VALUES ($1, $2, $3)
          RETURNING id, name, email, created_at, updated_at
        `;
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      const query = `
        SELECT * FROM users WHERE email = $1
        `;

      const result = await db.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async findUserById(userId) {
    try {
      const query = `
        SELECT * FROM users WHERE id = $1
        `;

      const result = await db.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async saveRefreshToken(userId, refreshToken, validUntil, deviceInfo = "") {
    try {
      const query = `
      INSERT INTO user_token (refresh_token, user_id, valid_until, revoked, device_info)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING refresh_token, user_id, valid_until, revoked, created_at
    `;
      const values = [refreshToken, userId, validUntil, false, deviceInfo];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async userRevoke(userId, token, revokedReason) {
    try {
      const query = `
        UPDATE user_token
        SET revoked = true,
            revoked_at = NOW(),
            revoked_reason = $3
        WHERE user_id = $1
        AND refresh_token = $2
        `;
      const result = await db.query(query, [userId, token, revokedReason]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async verifyRefreshToken(userId, refreshToken) {
    try {
      const query = `
          SELECT id, email, name, refresh_token, refresh_token_valid_until, revoked
          FROM users
          WHERE id = $1 AND refresh_token = $2
        `;

      const values = [userId, refreshToken];
      const result = await db.query(query, values);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}
