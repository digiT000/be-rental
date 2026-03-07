export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// user not exist, content detail not exist
export class NotFoundError extends AppError {
  constructor(message: string, statusCode: number = 404) {
    super(message, statusCode);
  }
}

// When user do request and some of the result got failed
export class InvalidRequestError extends AppError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
  }
}

// When user is not authenticated
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required', statusCode: number = 401) {
    super(message, statusCode);
  }
}

// When user lacks permission to access resource
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden', statusCode: number = 403) {
    super(message, statusCode);
  }
}

// When there's a conflict (e.g., duplicate resource)
export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', statusCode: number = 409) {
    super(message, statusCode);
  }
}

// When data validation fails
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', statusCode: number = 422) {
    super(message, statusCode);
  }
}

// When an unexpected server error occurs
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', statusCode: number = 500) {
    super(message, statusCode);
  }
}

// When a service or external dependency is unavailable
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable', statusCode: number = 503) {
    super(message, statusCode);
  }
}

// When the request payload is too large
export class PayloadTooLargeError extends AppError {
  constructor(message: string = 'Request payload too large', statusCode: number = 413) {
    super(message, statusCode);
  }
}

// When rate limit is exceeded
export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Too many requests', statusCode: number = 429) {
    super(message, statusCode);
  }
}
