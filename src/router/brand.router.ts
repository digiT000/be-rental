import express, { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import BrandController from "../controller/brand.controller.js";
import { authorizationMiddlware } from "../middleware/auth.middleware.js";
import {
  brandRequestValidator,
  createBrandValidator,
  updateBrandValidator,
  brandParamsExistValidator,
  getBrandsValidator,
} from "../middleware/validation/brand.validator.js";

const router: Router = express.Router();
const brandControllerInstance = new BrandController();

router.get(
  "/",
  authorizationMiddlware("admin", true),
  getBrandsValidator,
  brandRequestValidator,
  asyncHandler(brandControllerInstance.getBrands.bind(brandControllerInstance))
);
router.get(
  "/:id",
  authorizationMiddlware("admin", true),
  brandParamsExistValidator,
  brandRequestValidator,
  asyncHandler(
    brandControllerInstance.getBrandById.bind(brandControllerInstance)
  )
);

router.get(
  "/request-upload",
  authorizationMiddlware("admin"),
  asyncHandler(brandControllerInstance.requestBrandImageUrl)
);

router.post(
  "/",
  authorizationMiddlware("admin"),
  createBrandValidator,
  brandRequestValidator,
  asyncHandler(
    brandControllerInstance.createBrand.bind(brandControllerInstance)
  )
);

router.put(
  "/",
  authorizationMiddlware("admin"),
  updateBrandValidator,
  brandRequestValidator,
  asyncHandler(
    brandControllerInstance.updateBrand.bind(brandControllerInstance)
  )
);
router.put(
  "/delete",
  authorizationMiddlware("admin"),
  brandParamsExistValidator,
  brandRequestValidator,
  asyncHandler(
    brandControllerInstance.updateBrand.bind(brandControllerInstance)
  )
);

export default router;
