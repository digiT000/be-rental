import { UserResponseDTO } from './user-response.dto.js';

/**
 * DTO for successful login response
 * Contains user data and access token
 * Note: refreshToken is sent via httpOnly cookie, not in response body
 */
export interface LoginResponseDTO {
  /** User information */
  user: UserResponseDTO;

  /** JWT access token for API authentication (expires in 30 minutes) */
  accessToken: string;

  // NOTE: refreshToken is intentionally excluded from response body
  // It's sent as an httpOnly cookie for security
}
