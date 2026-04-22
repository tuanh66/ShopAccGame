import { body } from "express-validator";

export const cardTopUpValidator = [
  body("telco")
    .notEmpty()
    .withMessage("Vui lòng chọn nhà mạng.")
    .isString()
    .withMessage("Nhà mạng không hợp lệ."),

  body("pin")
    .notEmpty()
    .withMessage("Bạn chưa nhập mã thẻ.")
    .isString()
    .withMessage("Mã thẻ không hợp lệ.")
    .trim(),

  body("serial")
    .notEmpty()
    .withMessage("Bạn chưa nhập số sê-ri.")
    .isString()
    .withMessage("Số sê-ri không hợp lệ.")
    .trim(),

  body("amount")
    .notEmpty()
    .withMessage("Vui lòng chọn mệnh giá.")
    .isNumeric()
    .withMessage("Mệnh giá phải là số.")
    .custom((value) => {
      if (Number(value) <= 0) {
        throw new Error("Mệnh giá phải lớn hơn 0.");
      }
      return true;
    }),
];