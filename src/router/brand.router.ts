import express, { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import BrandController from '../controller/brand.controller.js';
import { authorizationMiddlware } from '../middleware/auth.middleware.js';
import {
  brandRequestValidator,
  createBrandValidator,
} from '../middleware/validation/brand.validator.js';

const router: Router = express.Router();
const brandControllerInstance = new BrandController();

router.get(
  '/request-upload',
  authorizationMiddlware('admin'),
  asyncHandler(brandControllerInstance.requestBrandImageUrl)
);

router.post(
  '/',
  authorizationMiddlware('admin'),
  createBrandValidator,
  brandRequestValidator,
  asyncHandler(brandControllerInstance.createBrand)
);

export default router;
