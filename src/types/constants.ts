export const LOGOUT_REASON = {
  USER_LOGOUT: 'USER_LOGOUT',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  SECURITY_BREACH: 'SECURITY_BREACH',
} as const;

export type LogoutReason = typeof LOGOUT_REASON[keyof typeof LOGOUT_REASON];

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
