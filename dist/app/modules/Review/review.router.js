"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const imageUpload_1 = __importDefault(require("../../middleware/imageUpload"));
const router = (0, express_1.Router)();
router.get("/all-reviews", review_controller_1.getAllReview);
router.get("/review-details/:id", review_controller_1.getReviewById);
router.post("/add-review", imageUpload_1.default.single('image'), review_controller_1.createReview);
router.post("/update-review/:id", imageUpload_1.default.single('image'), review_controller_1.updateReview);
exports.default = router;
