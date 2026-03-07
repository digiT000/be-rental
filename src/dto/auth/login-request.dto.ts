/**
 * DTO for user login request
 * Used to type-check incoming login credentials
 */
export interface LoginRequestDTO {
  /** User's email address */
  email: string;

  /** User's password */
  password: string;
}
