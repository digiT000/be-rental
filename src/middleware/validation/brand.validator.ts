import { Request, Response, NextFunction } from "express";
import {
  body,
  validationResult,
  ValidationChain,
  param,
} from "express-validator";

export const createBrandValidator: ValidationChain[] = [
  body("name").notEmpty().trim().withMessage("Please input name"),
  body("logoUrl").notEmpty().trim().withMessage("please provide image url"),
];

export const updateBrandValidator: ValidationChain[] = [
  body("id").notEmpty().trim().withMessage("Please provide brand id"),
  body("name").optional().notEmpty().trim().withMessage("Please input name"),
  body("logoUrl")
    .optional()
    .notEmpty()
    .trim()
    .withMessage("please provide image url"),
];

export const brandParamsExistValidator: ValidationChain[] = [
  param("id").notEmpty().trim().withMessage("Please provide brand id"),
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

export function brandRequestValidator(
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
