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
exports.updateBlogFromDB = exports.blogdelete = exports.createBlogFromDB = exports.getBlogByFilter = exports.getBlogByIdFromDB = exports.getAllBlogFromDB = void 0;
const blog_model_1 = require("./blog.model");
const getAllBlogFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return blog_model_1.Blogs.find().sort({ createdAt: -1, });
});
exports.getAllBlogFromDB = getAllBlogFromDB;
const getBlogByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return blog_model_1.Blogs.find({ _id: id });
});
exports.getBlogByIdFromDB = getBlogByIdFromDB;
const getBlogByFilter = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return blog_model_1.Blogs.find({ blog_category: data });
});
exports.getBlogByFilter = getBlogByFilter;
const createBlogFromDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = new Product(data); //User -> class  user -> instance
    yield data.save();
    return data;
});
exports.createBlogFromDB = createBlogFromDB;
const blogdelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = new Product(data); //User -> class  user -> instance
    return blog_model_1.Blogs.deleteOne({ _id: id });
});
exports.blogdelete = blogdelete;
const updateBlogFromDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield blog_model_1.Blogs.updateOne({ _id: id }, { $set: data }, { new: true });
        if (result.modifiedCount === 0) {
            throw new Error("Blogs not found or not modified");
        }
        const updatedDocument = yield blog_model_1.Blogs.findById(id);
        if (!updatedDocument) {
            throw new Error("Blogs not found");
        }
        return updatedDocument;
    }
    catch (error) {
        console.error("Error updating Blogs:", error);
        throw error;
    }
});
exports.updateBlogFromDB = updateBlogFromDB;
