import { Request, Response, NextFunction } from "express";
import {
  body,
  validationResult,
  ValidationChain,
  param,
} from "express-validator";
import { VehicleType } from "../../types/database.types.js";

const VEHICLE_TYPES: VehicleType[] = ["car", "motorcycle"];

const ALLOWED_BODY_KEYS_UPDATE = [
  "name",
  "brandId",
  "pricePerDay",
  "year",
  "type",
  "imageUrl",
  "features",
];

export const createVehicleModelValidator: ValidationChain[] = [
  body("name").notEmpty().trim().withMessage("Please input name"),
  body("brandId").notEmpty().trim().withMessage("Please input brandId"),
  body("pricePerDay")
    .notEmpty()
    .isNumeric()
    .withMessage("Please input price per day"),
  body("year").notEmpty().isNumeric().withMessage("Please input year"),
  body("type")
    .notEmpty()
    .trim()
    .isIn(VEHICLE_TYPES)
    .withMessage(`Type must be one of: ${VEHICLE_TYPES.join(", ")}`),
  body("imageUrl").notEmpty().trim().withMessage("please provide image url"),
  body("features")
    .optional()
    .isObject()
    .withMessage("features must be a valid JSON object"),
];

// ...existing code...

export const updateVehicleModelValidator: ValidationChain[] = [
  body().custom((_, { req }) => {
    const inputKeys = Object.keys(req.body);
    const invalidKeys = inputKeys.filter(
      (key) => !ALLOWED_BODY_KEYS_UPDATE.includes(key)
    );

    if (invalidKeys.length > 0) {
      throw new Error(`Invalid body request`);
    }

    return true;
  }),
  body("name").optional().trim().isString().withMessage("Please input name"),
  body("brandId")
    .optional()
    .trim()
    .isString()
    .withMessage("Please input brandId"),
  body("pricePerDay")
    .optional()
    .isNumeric()
    .withMessage("Please input a valid price per day"),
  body("year").optional().isNumeric().withMessage("Please input a valid year"),
  body("type")
    .optional()
    .trim()
    .isIn(VEHICLE_TYPES)
    .withMessage(`Type must be one of: ${VEHICLE_TYPES.join(", ")}`),
  body("imageUrl")
    .optional()
    .trim()
    .isString()
    .withMessage("Please provide image url"),
  body("features")
    .optional()
    .isObject()
    .withMessage("features must be a valid JSON object"),
];

// ...existing code...

export const vehicleModelParamsExistValidator: ValidationChain[] = [
  param("id").notEmpty().trim().withMessage("Please provide vehicle id"),
];

export const getBrandsValidator: ValidationChain[] = [
  body("page")
    .notEmpty()
    .withMessage("Page is required")
    .isInt({ min: 0 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  body("limit")
    .notEmpty()
    .withMessage("Limit is required")
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer")
    .toInt(),
];

export function vehicleModelRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => ({
        type: err.type,
        message: err.msg,
      })),
    });
  }
  next();
}
