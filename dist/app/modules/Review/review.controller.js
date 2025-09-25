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
exports.updateReview = exports.createReview = exports.getReviewById = exports.getAllReview = void 0;
const responseHandler_1 = require("../../utlis/responseHandler");
const cloudinary_1 = __importDefault(require("../../utlis/cloudinary"));
const review_model_1 = require("./review.model");
const review_service_1 = require("./review.service");
const getAllReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, review_service_1.getAllReviewFromDB)();
    (0, responseHandler_1.sendApiResponse)(res, 200, true, products);
});
exports.getAllReview = getAllReview;
const getReviewById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield (0, review_service_1.getReviewByIdFromDB)(id);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.getReviewById = getReviewById;
const createReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { review_name, review, description } = req.body;
    // Upload image to Cloudinary
    const result = yield cloudinary_1.default.uploader.upload(req.file.path);
    // Get the image URL from the Cloudinary response
    const imageUrl = result.secure_url;
    const newBlog = new review_model_1.Review({
        review_name,
        description,
        review,
        image: imageUrl,
    });
    const product = yield (0, review_service_1.createReviewFromDB)(newBlog);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.createReview = createReview;
const updateReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { review_name, review, description } = req.body;
    const productId = req.params.id;
    const existingProduct = yield review_model_1.Review.findById(productId);
    let imageUrl = existingProduct.image;
    if (req.file) {
        const result = yield cloudinary_1.default.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
    }
    const newBlog = new review_model_1.Review({
        review_name,
        description,
        review,
        image: imageUrl,
    });
    const newPlauload = {
        review_name: newBlog.review_name,
        description: newBlog.description,
        review: newBlog.review,
        image: newBlog.image
    };
    const result = yield (0, review_service_1.updateReviewFromDB)(productId, newPlauload);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, result);
});
exports.updateReview = updateReview;
