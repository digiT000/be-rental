import { User } from '../../types/database.types.js';
import { UserResponseDTO } from './user-response.dto.js';
import { LoginResponseDTO } from './login-response.dto.js';

/**
 * Transforms a User database model to UserResponseDTO
 * Excludes sensitive fields like password
 * 
 * @param user - User model from database (with password field omitted)
 * @returns UserResponseDTO safe for API responses
 */
export const toUserResponse = (user: Omit<User, 'password'>): UserResponseDTO => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.created_at,
});

/**
 * Transforms user data and access token into LoginResponseDTO
 * 
 * @param user - User response DTO
 * @param accessToken - JWT access token
 * @returns LoginResponseDTO with user data and token
 */
export const toLoginResponse = (
  user: UserResponseDTO,
  accessToken: string
): LoginResponseDTO => ({
  user,
  accessToken,
});

/**
 * Helper function to create a complete login response from user and tokens
 * Combines toUserResponse and toLoginResponse
 * 
 * @param user - User model from database
 * @param accessToken - JWT access token
 * @returns Complete LoginResponseDTO
 */
export const toCompleteLoginResponse = (
  user: Omit<User, 'password'>,
  accessToken: string
): LoginResponseDTO => {
  const userDto = toUserResponse(user);
  return toLoginResponse(userDto, accessToken);
};
