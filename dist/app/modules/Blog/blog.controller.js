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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlog = exports.blogDelete = exports.filterBlog = exports.createBlog = exports.getBlogById = exports.getAllBlog = void 0;
const blog_service_1 = require("./blog.service");
const responseHandler_1 = require("../../utlis/responseHandler");
const cloudinary_1 = __importDefault(require("../../utlis/cloudinary"));
const blog_model_1 = require("./blog.model");
const getAllBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, blog_service_1.getAllBlogFromDB)();
    (0, responseHandler_1.sendApiResponse)(res, 200, true, products);
});
exports.getAllBlog = getAllBlog;
const getBlogById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield (0, blog_service_1.getBlogByIdFromDB)(id);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.getBlogById = getBlogById;
const createBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { blog_title, blog_name, blog_category, description } = req.body;
    // Upload image to Cloudinary
    const result = yield cloudinary_1.default.uploader.upload(req.file.path);
    // Get the image URL from the Cloudinary response
    const imageUrl = result.secure_url;
    const newBlog = new blog_model_1.Blogs({
        blog_title,
        blog_name,
        blog_category,
        description,
        image: imageUrl,
    });
    const product = yield (0, blog_service_1.createBlogFromDB)(newBlog);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.createBlog = createBlog;
const filterBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.params.search;
    const result = yield (0, blog_service_1.getBlogByFilter)(search);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, result);
});
exports.filterBlog = filterBlog;
const blogDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield (0, blog_service_1.blogdelete)(id);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, result);
});
exports.blogDelete = blogDelete;
const updateBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { blog_title, blog_name, blog_category, description } = req.body;
    const blogId = req.params.id;
    const existingProduct = yield blog_model_1.Blogs.findById(blogId);
    let imageUrl = existingProduct.image;
    if (req.file) {
        const result = yield cloudinary_1.default.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
    }
    const newBlog = new blog_model_1.Blogs({
        blog_title,
        blog_name,
        blog_category,
        description,
        image: imageUrl,
    });
    const updatePayload = {
        blog_title: newBlog.blog_title,
        blog_name: newBlog.blog_name,
        blog_category: newBlog.blog_category,
        description: newBlog.description,
        image: newBlog.image,
    };
    const product = yield (0, blog_service_1.updateBlogFromDB)(blogId, updatePayload);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.updateBlog = updateBlog;
