import { db } from '../config/database.js';
import { User, UserToken } from '../types/database.types.js';

export class UserModel {
  async create(
    name: string,
    email: string,
    hashedPassword: string,
    role: 'user' | 'admin' | 'super_admin' = 'user'
  ): Promise<Omit<User, 'password'>> {
    const result = await db
      .insertInto('users')
      .values({
        name,
        email,
        password: hashedPassword,
        role,
      })
      .returning(['id', 'name', 'email', 'role', 'created_at', 'updated_at'])
      .executeTakeFirstOrThrow();

    return result;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
  }

  async findUserById(userId: number): Promise<User | undefined> {
    return await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', userId)
      .executeTakeFirst();
  }

  async saveRefreshToken(
    userId: number,
    refreshToken: string,
    validUntil: Date,
    deviceInfo: string = ''
  ): Promise<Pick<UserToken, 'refresh_token' | 'user_id' | 'valid_until' | 'revoked' | 'created_at'>> {
    const result = await db
      .insertInto('user_token')
      .values({
        refresh_token: refreshToken,
        user_id: userId,
        valid_until: validUntil,
        revoked: false,
        device_info: deviceInfo,
      })
      .returning(['refresh_token', 'user_id', 'valid_until', 'revoked', 'created_at'])
      .executeTakeFirstOrThrow();

    return result;
  }

  async userRevoke(userId: number, token: string, revokedReason: string): Promise<void> {
    await db
      .updateTable('user_token')
      .set({
        revoked: true,
        revoked_at: new Date(),
        revoked_reason: revokedReason,
      })
      .where('user_id', '=', userId)
      .where('refresh_token', '=', token)
      .execute();
  }

  async verifyRefreshToken(
    refreshToken: string
  ): Promise<
    | {
        id: number;
        email: string;
        name: string;
        refresh_token: string;
        valid_until: Date;
        revoked: boolean;
      }
    | undefined
  > {
    return await db
      .selectFrom('user_token as ut')
      .innerJoin('users as u', 'u.id', 'ut.user_id')
      .select([
        'u.id',
        'u.email',
        'u.name',
        'ut.refresh_token',
        'ut.valid_until',
        'ut.revoked',
      ])
      .where('ut.refresh_token', '=', refreshToken)
      .where('ut.revoked', '=', false)
      .where('ut.valid_until', '>', new Date())
      .executeTakeFirst();
  }
}
