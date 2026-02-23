import { UnauthorizedError } from "../utils/appError.js";

// function authorizationMiddlware(req, res, next) {
//   const accessToken = req.headers;
// }

function refreshTokenAuthorization(req, res, next) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedError("Refresh token not found. Please login again");
  }

  req.refreshToken = refreshToken;

  next();
}

export { refreshTokenAuthorization };
