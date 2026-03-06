import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import BrandController from "./../controller/brand.controller.js";
import { authorizationMiddlware } from "../middleware/auth.middleware.js";

const router = express.Router();
const brandControllerInstance = new BrandController();

router.get(
  "/request-upload",
  authorizationMiddlware("admin"),
  asyncHandler(
    brandControllerInstance.requestBrandImageUrl.bind(brandControllerInstance)
  )
);

export default router;
