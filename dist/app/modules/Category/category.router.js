"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const imageUpload_1 = __importDefault(require("../../middleware/imageUpload"));
const router = (0, express_1.Router)();
router.post("/create", imageUpload_1.default.single("image"), category_controller_1.addCategory);
router.delete("/create-delete/:id", category_controller_1.deleteCategory);
router.patch("/update/:id", imageUpload_1.default.single("image"), category_controller_1.updateCategory);
exports.default = router;
