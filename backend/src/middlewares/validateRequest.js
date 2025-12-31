import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = {};

    errors.array().forEach(err => {
      // mỗi field chỉ lấy lỗi đầu tiên
      if (!formattedErrors[err.path]) {
        formattedErrors[err.path] = err.msg;
      }
    });

    return res.status(422).json(formattedErrors);
  }

  next();
};