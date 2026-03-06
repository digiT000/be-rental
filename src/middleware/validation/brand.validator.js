import { body, validationResult } from "express-validator";

export const createBrandValidator = [
  body("name").notEmpty().trim().withMessage("Please input name"),
  body("logoUrl").notEmpty().trim().withMessage("please provide image url"),
];
export function brandRequestValidator(req, res, next) {
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
