/**
 * DTO for user registration request
 * Used to type-check incoming registration data
 */
export interface RegisterRequestDTO {
  /** User's full name */
  name: string;

  /** User's email address (must be valid email format) */
  email: string;

  /** User's password (minimum 8 characters) */
  password: string;

  /** Internal use only: User role assignment */
  intenalRoleOnly?: 'user' | 'admin' | 'super_admin';
}
