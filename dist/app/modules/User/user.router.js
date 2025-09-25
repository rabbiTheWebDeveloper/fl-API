"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.post("/registration", (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), user_controller_1.registration);
router.post("/login", user_controller_1.login);
router.post("/user-update/:id", user_controller_1.userUpdate);
// router.post("/profileUpdate",AuthVerifyMiddleware,UsersController.profileUpdate);
// router.get("/profileDetails",AuthVerifyMiddleware,UsersController.profileDetails);
exports.default = router;
