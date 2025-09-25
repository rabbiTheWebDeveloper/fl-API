"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const imageUpload_1 = __importDefault(require("../../middleware/imageUpload"));
const router = (0, express_1.Router)();
router.get("/allProducts", product_controller_1.getAllProducts);
router.get("/details/:id", product_controller_1.getProductById);
router.get("/product-filter/:sortBy", product_controller_1.getProductByFilter);
router.post("/addProducts", imageUpload_1.default.single("image"), product_controller_1.createProduct);
router.post("/product-update/:id", imageUpload_1.default.single("image"), product_controller_1.updateProduct);
router.get("/product-delete/:id", product_controller_1.productDelete);
exports.default = router;
