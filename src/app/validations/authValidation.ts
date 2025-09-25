const { body } = require("express-validator");
const User = require("../models/User");
export const signupValidation = [
  body("fullname").not().isEmpty().trim().withMessage("fullname is required"),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .custom(async (email:string) => {
      const user = await User.findOne({ email });
      if (user) {
        return Promise.reject("Email already use");
      }
    })
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password should be 6 characters long"),
];

