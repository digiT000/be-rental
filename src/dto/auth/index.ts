/**
 * Auth DTOs - Centralized export for all authentication-related DTOs
 * Import from this file for convenience: import { LoginRequestDTO, UserResponseDTO } from '../dto/auth'
 */

// Request DTOs
export type { RegisterRequestDTO } from './register-request.dto.js';
export type { LoginRequestDTO } from './login-request.dto.js';

// Response DTOs
export type { UserResponseDTO } from './user-response.dto.js';
export type { LoginResponseDTO } from './login-response.dto.js';
export type { RefreshTokenResponseDTO } from './refresh-token-response.dto.js';

// Mappers
export { toUserResponse, toLoginResponse, toCompleteLoginResponse } from './mappers.js';
