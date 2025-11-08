"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const imageUpload_1 = __importDefault(require("../../middleware/imageUpload"));
const router = (0, express_1.Router)();
// ✅ Create Product
router.post("/create", imageUpload_1.default.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
    { name: "variantImages", maxCount: 50 },
]), product_controller_1.createProduct);
// ✅ Update Product
router.post("/update/:productId", imageUpload_1.default.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
    { name: "variantImages", maxCount: 50 },
]), product_controller_1.updateProduct);
// ✅ Delete Product
router.delete("/delete/:productId", product_controller_1.deleteProduct);
exports.default = router;
