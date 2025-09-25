"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// middlewares/imageUpload.ts
const multer_1 = __importDefault(require("multer"));
// Set up multer storage
const storage = multer_1.default.diskStorage({});
// Initialize multer upload
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
