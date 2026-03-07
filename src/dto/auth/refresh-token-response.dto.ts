/**
 * DTO for refresh token response
 * Contains only the new access token
 */
export interface RefreshTokenResponseDTO {
  /** New JWT access token */
  token: string;
}
