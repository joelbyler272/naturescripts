/**
 * Centralized error codes and messages
 * Provides consistent error handling across the application
 */

export const ERROR_CODES = {
  // Authentication errors
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',

  // Subscription errors
  SUBSCRIPTION_ALREADY_PRO: 'SUBSCRIPTION_ALREADY_PRO',
  SUBSCRIPTION_NOT_FOUND: 'SUBSCRIPTION_NOT_FOUND',
  SUBSCRIPTION_CREATE_FAILED: 'SUBSCRIPTION_CREATE_FAILED',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Consultation errors
  CONSULTATION_LIMIT_REACHED: 'CONSULTATION_LIMIT_REACHED',
  CONSULTATION_NOT_FOUND: 'CONSULTATION_NOT_FOUND',
  CONSULTATION_SAVE_FAILED: 'CONSULTATION_SAVE_FAILED',

  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  DATABASE_CONNECTION_FAILED: 'DATABASE_CONNECTION_FAILED',

  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * User-friendly error messages for each error code
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.AUTH_UNAUTHORIZED]: 'Please sign in to continue.',
  [ERROR_CODES.AUTH_SESSION_EXPIRED]: 'Your session has expired. Please sign in again.',

  [ERROR_CODES.SUBSCRIPTION_ALREADY_PRO]: 'You already have a Pro subscription.',
  [ERROR_CODES.SUBSCRIPTION_NOT_FOUND]: 'No active subscription found.',
  [ERROR_CODES.SUBSCRIPTION_CREATE_FAILED]: 'Failed to create subscription. Please try again.',

  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please wait a moment and try again.',

  [ERROR_CODES.CONSULTATION_LIMIT_REACHED]: 'You have reached your daily consultation limit. Upgrade to Pro for unlimited access.',
  [ERROR_CODES.CONSULTATION_NOT_FOUND]: 'This consultation could not be found.',
  [ERROR_CODES.CONSULTATION_SAVE_FAILED]: 'Failed to save your consultation. Please try again.',

  [ERROR_CODES.DATABASE_ERROR]: 'A database error occurred. Please try again.',
  [ERROR_CODES.DATABASE_CONNECTION_FAILED]: 'Unable to connect to the database. Please try again later.',

  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
};

/**
 * Get a user-friendly error message for an error code
 */
export function getErrorMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
}
