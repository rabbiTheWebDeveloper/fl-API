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
exports.updateCategory = exports.deleteCategory = exports.addCategory = void 0;
const responseHandler_1 = require("../../utlis/responseHandler");
const category_service_1 = require("./category.service");
const slugify_1 = __importDefault(require("slugify"));
const category_model_1 = require("./category.model");
const imagekit_1 = __importDefault(require("../../utlis/imagekit"));
const addCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name || typeof name !== "string") {
            return res
                .status(400)
                .json({ success: false, message: "Category name is required" });
        }
        let imageUrl = "";
        let imageFileId = "";
        if (req.file) {
            const uploadResponse = yield imagekit_1.default.upload({
                file: req.file.buffer.toString("base64"),
                fileName: `${(0, slugify_1.default)(name || "category", {
                    lower: true,
                })}-${Date.now()}.jpg`,
                folder: "/categories",
            });
            imageUrl = uploadResponse.url;
            imageFileId = uploadResponse.fileId; // ✅ save fileId for delete later
        }
        const payload = Object.assign(Object.assign({}, req.body), { image: imageUrl, imageFileId: imageFileId });
        const category = yield (0, category_service_1.createCategoryFromDB)(payload);
        (0, responseHandler_1.sendApiResponse)(res, 200, true, category);
    }
    catch (error) {
        next(error);
    }
});
exports.addCategory = addCategory;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Delete category called", req.params.id);
        const category = yield category_model_1.Categorys.findById(req.params.id);
        if (!category) {
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        }
        // delete image if exists
        if (category.imageFileId) {
            const imageFileId = category.imageFileId;
            yield imagekit_1.default.deleteFile(imageFileId);
        }
        console.log("Category found: ", category);
        yield (0, category_service_1.categorydeleteService)(req.params.id);
        (0, responseHandler_1.sendApiResponse)(res, 200, true, {
            message: "Category deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCategory = deleteCategory;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.Categorys.findById(req.params.id);
        if (!category) {
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        }
        let imageUrl = category.image; // keep old image by default
        let imageFileId = category.imageFileId; // keep old fileId by default
        // If new image uploaded
        if (req.file) {
            // delete old image if exists
            if (category.imageFileId) {
                yield imagekit_1.default.deleteFile(category.imageFileId);
            }
            // upload new image
            const uploadResponse = yield imagekit_1.default.upload({
                file: req.file.buffer.toString("base64"),
                fileName: `${(0, slugify_1.default)(req.body.name || category.name || "category", {
                    lower: true,
                })}-${Date.now()}.jpg`,
                folder: "/categories",
            });
            imageUrl = uploadResponse.url;
            imageFileId = uploadResponse.fileId;
        }
        const updatedCategory = yield (0, category_service_1.updateCategoryFromDB)(req.params.id, Object.assign(Object.assign({}, req.body), { image: imageUrl, imageFileId: imageFileId }));
        (0, responseHandler_1.sendApiResponse)(res, 200, true, updatedCategory);
    }
    catch (error) {
        next(error);
    }
});
exports.updateCategory = updateCategory;
