import db from "../config/postgres.js";

export class UserModel {
  async create(name, email, hashedPassword) {
    const values = [name, email, hashedPassword];

    const query = `
          INSERT INTO users (name, email, password)
          VALUES ($1, $2, $3)
          RETURNING id, name, email, created_at, updated_at
        `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findUserByEmail(email) {
    const query = `
        SELECT * FROM users WHERE email = $1
        `;

    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  async findUserById(userId) {
    const query = `
        SELECT * FROM users WHERE id = $1
        `;

    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  async saveRefreshToken(userId, refreshToken, validUntil, deviceInfo = "") {
    const query = `
      INSERT INTO user_token (refresh_token, user_id, valid_until, revoked, device_info)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING refresh_token, user_id, valid_until, revoked, created_at
    `;
    const values = [refreshToken, userId, validUntil, false, deviceInfo];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async userRevoke(userId, token, revokedReason) {
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
  }

  async verifyRefreshToken(refreshToken) {
    const query = `
          SELECT u.id, u.email, u.name,
          ut.refresh_token,
          ut.valid_until,
          ut.revoked
          FROM user_token ut
          JOIN users u ON u.id = ut.user_id
          WHERE ut.refresh_token = $1
          AND ut.revoked = false
          AND ut.valid_until > NOW()
        `;

    const values = [refreshToken];
    const result = await db.query(query, values);

    return result.rows[0];
  }
}
