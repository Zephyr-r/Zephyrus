import { body, validationResult } from "express-validator";

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      errors: errors.array(),
    });
  };
};

export const productValidation = [
  body("name").trim().isLength({ min: 3, max: 100 }),
  body("price").isFloat({ min: 0 }),
  body("description").trim().isLength({ min: 10, max: 1000 }),
  body("category").isIn([
    "electronics",
    "clothing",
    "books",
    "furniture",
    "sports",
    "others",
  ]),
  body("condition").isIn(["new", "like-new", "good", "fair", "poor"]),
];
