import express, { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import AuthController from '../controller/auth.controller.js';
import {
  authRegisterValidator,
  authLoginValidator,
} from '../middleware/validation/auth.validator.js';
import {
  authorizationMiddlware,
  refreshTokenAuthorization,
} from '../middleware/auth.middleware.js';

const router: Router = express.Router();
const authControllerInstance = new AuthController();

router.put('/login', authLoginValidator, asyncHandler(authControllerInstance.login));

router.post('/register', authRegisterValidator, asyncHandler(authControllerInstance.register));

router.get(
  '/get-token',
  asyncHandler(refreshTokenAuthorization),
  asyncHandler(authControllerInstance.getNewAccessToken)
);

router.put(
  '/logout',
  asyncHandler(refreshTokenAuthorization),
  asyncHandler(authorizationMiddlware()),
  asyncHandler(authControllerInstance.logout)
);

export default router;
