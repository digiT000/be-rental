import { body, validationResult } from "express-validator";

const authRegisterValidator = [
  body("name").notEmpty().trim().withMessage("Please input name"),
  body("email").isEmail().withMessage("Not a valid e-mail address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  authRequest,
];

const authLoginValidator = [
  body("email").isEmail().withMessage("Not a valid e-mail address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  authRequest,
];

function authRequest(req, res, next) {
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

export { authLoginValidator, authRegisterValidator };
