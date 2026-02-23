export default function handleError(error, req, res, next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";

  // Handle PostgreSQL duplicate key error
  if (error.code === "23505") {
    const match = error.detail?.match(/Key \(([^)]+)\)/);
    const field = match ? match[1] : "field";

    statusCode = 409;
    message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } already exists`;

    return res.status(statusCode).json({
      success: false,
      message: message,
      error: "Duplicate entry",
    });
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again";

    return res.status(statusCode).json({
      success: false,
      message: message,
      error: "Authentication failed",
    });
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please login again";

    return res.status(statusCode).json({
      success: false,
      message: message,
      error: "Token expired",
    });
  }

  if (error.name === "NotBeforeError") {
    statusCode = 401;
    message = "Token not yet valid";

    return res.status(statusCode).json({
      success: false,
      message: message,
      error: "Invalid token",
    });
  }

  return res.status(statusCode).json({
    message: error.message,
  });
}
