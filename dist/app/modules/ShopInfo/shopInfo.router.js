"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shopInfo_controller_1 = require("./shopInfo.controller");
const imageUpload_1 = __importDefault(require("../../middleware/imageUpload"));
const router = (0, express_1.Router)();
router.post("/shopinfo-update", imageUpload_1.default.fields([
    { name: "companyLogo", maxCount: 1 }, // Single company logo
    { name: "favicon", maxCount: 1 }, // Single favicon
]), shopInfo_controller_1.updateShopInfoController);
exports.default = router;
