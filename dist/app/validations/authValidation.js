"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupValidation = void 0;
const { body } = require("express-validator");
const User = require("../models/User");
exports.signupValidation = [
    body("fullname").not().isEmpty().trim().withMessage("fullname is required"),
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User.findOne({ email });
        if (user) {
            return Promise.reject("Email already use");
        }
    }))
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("password should be 6 characters long"),
];
