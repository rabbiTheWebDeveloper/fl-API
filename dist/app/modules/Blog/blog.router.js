"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("./blog.controller");
const imageUpload_1 = __importDefault(require("../../middleware/imageUpload"));
const AuthVerifyMiddleware_1 = require("../../middleware/AuthVerifyMiddleware");
const router = (0, express_1.Router)();
router.get("/allBlog", blog_controller_1.getAllBlog);
router.get("/blogDetails/:id", blog_controller_1.getBlogById);
router.post("/addBlog", imageUpload_1.default.single('image'), AuthVerifyMiddleware_1.auth, blog_controller_1.createBlog);
router.get("/searchBlog/:search", blog_controller_1.filterBlog);
router.get("/blog-delete/:id", AuthVerifyMiddleware_1.auth, blog_controller_1.blogDelete);
router.post("/blog-update/:id", imageUpload_1.default.single('image'), AuthVerifyMiddleware_1.auth, blog_controller_1.updateBlog);
exports.default = router;
