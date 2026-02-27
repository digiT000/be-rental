import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import AuthController from "../controller/auth.controller.js";
import {
  authRegisterValidator,
  authLoginValidator,
} from "../middleware/validation/auth.validator.js";
import {
  authorizationMiddlware,
  refreshTokenAuthorization,
} from "../middleware/auth.middleware.js";

const router = express.Router();
const authControllerInstance = new AuthController();

router.put(
  "/login",

  authLoginValidator,
  asyncHandler(authControllerInstance.login.bind(authControllerInstance))
);
router.post(
  "/register",

  authRegisterValidator,
  asyncHandler(authControllerInstance.register.bind(authControllerInstance))
);
router.get(
  "/get-token",

  asyncHandler(refreshTokenAuthorization),
  asyncHandler(
    authControllerInstance.getNewAccessToken.bind(authControllerInstance)
  )
);
router.put(
  "/logout",
  asyncHandler(refreshTokenAuthorization),
  asyncHandler(authorizationMiddlware),
  asyncHandler(authControllerInstance.logout.bind(authControllerInstance))
);

export default router;
