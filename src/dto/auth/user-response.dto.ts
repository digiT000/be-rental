/**
 * DTO for user data in API responses
 * Excludes sensitive fields like password
 */
export interface UserResponseDTO {
  /** User's unique identifier (UUID) */
  id: string;

  /** User's full name */
  name: string;

  /** User's email address */
  email: string;

  /** User's role in the system */
  role: string;

  /** Timestamp when user account was created */
  created_at: Date;

  // NOTE: password field is intentionally excluded for security
}
