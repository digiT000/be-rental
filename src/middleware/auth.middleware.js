import { UnauthorizedError } from "../utils/appError.js";
import jwt from "jsonwebtoken";

function authorizationMiddlware(roleAccess = "user") {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Access token not found. Please login again");
    }

    const accessToken = authHeader.split(" ")[1];

    // Verify access token here
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );

    if (roleAccess !== decoded.role) {
      throw new UnauthorizedError("You dont have access to this endpoint");
    }

    req.user = decoded;

    next();
  };
}

function refreshTokenAuthorization(req, res, next) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedError("Refresh token not found. Please login again");
  }

  req.refreshToken = refreshToken;

  next();
}

export { refreshTokenAuthorization, authorizationMiddlware };
