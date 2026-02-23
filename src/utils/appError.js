export class AppError extends Error {
  statusCode;

  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// user not exist, content detail not exist
export class NotFoundError extends AppError {
  constructor(message, statusCode = 404) {
    super(message, statusCode);
  }
}

// When user do request and some of the result got failed
export class InvalidRequestError extends AppError {
  constructor(message, statusCode = 400) {
    super(message, statusCode);
  }
}

// ...existing code...

// When user is not authenticated
export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required", statusCode = 401) {
    super(message, statusCode);
  }
}

// When user lacks permission to access resource
export class ForbiddenError extends AppError {
  constructor(message = "Access forbidden", statusCode = 403) {
    super(message, statusCode);
  }
}

// When there's a conflict (e.g., duplicate resource)
export class ConflictError extends AppError {
  constructor(message = "Resource conflict", statusCode = 409) {
    super(message, statusCode);
  }
}

// When data validation fails
export class ValidationError extends AppError {
  constructor(message = "Validation failed", statusCode = 422) {
    super(message, statusCode);
  }
}

// When an unexpected server error occurs
export class InternalServerError extends AppError {
  constructor(message = "Internal server error", statusCode = 500) {
    super(message, statusCode);
  }
}

// When a service or external dependency is unavailable
export class ServiceUnavailableError extends AppError {
  constructor(message = "Service temporarily unavailable", statusCode = 503) {
    super(message, statusCode);
  }
}

// When the request payload is too large
export class PayloadTooLargeError extends AppError {
  constructor(message = "Request payload too large", statusCode = 413) {
    super(message, statusCode);
  }
}

// When rate limit is exceeded
export class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests", statusCode = 429) {
    super(message, statusCode);
  }
}
