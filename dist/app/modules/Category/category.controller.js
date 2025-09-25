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
exports.addCategory = exports.generateUniqueSlug = void 0;
const responseHandler_1 = require("../../utlis/responseHandler");
const category_service_1 = require("./category.service");
const slugify_1 = __importDefault(require("slugify"));
const imagekit_1 = __importDefault(require("imagekit"));
const category_model_1 = require("./category.model");
const imagekit = new imagekit_1.default({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
const generateUniqueSlug = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const baseSlug = (0, slugify_1.default)(name, { lower: true, strict: true });
    const existing = yield category_model_1.Categorys.find({ slug: { $regex: `^${baseSlug}(-\\d+)?$`, $options: "i" } }, { slug: 1 });
    if (!existing.length)
        return baseSlug;
    // Extract numeric suffixes
    const numbers = existing.map((doc) => {
        const match = doc.slug.match(/-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    });
    const maxNum = Math.max(...numbers);
    return `${baseSlug}-${maxNum + 1}`;
});
exports.generateUniqueSlug = generateUniqueSlug;
const addCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name || typeof name !== "string") {
            return res
                .status(400)
                .json({ success: false, message: "Category name is required" });
        }
        let imageUrl = "";
        const slug = yield (0, exports.generateUniqueSlug)(name);
        if (req.file) {
            const uploadResponse = yield imagekit.upload({
                file: req.file.buffer.toString("base64"),
                fileName: `${(0, slugify_1.default)(name || "category", {
                    lower: true,
                })}-${Date.now()}.jpg`,
                folder: "/categories",
            });
            imageUrl = uploadResponse.url;
        }
        const payload = Object.assign(Object.assign({}, req.body), { slug, image: imageUrl });
        const category = yield (0, category_service_1.createCategoryFromDB)(payload);
        (0, responseHandler_1.sendApiResponse)(res, 200, true, category);
    }
    catch (error) {
        next(error);
    }
});
exports.addCategory = addCategory;
