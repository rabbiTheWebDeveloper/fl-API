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
exports.updateReviewFromDB = exports.createReviewFromDB = exports.getReviewByIdFromDB = exports.getAllReviewFromDB = void 0;
const review_model_1 = require("./review.model");
const getAllReviewFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return review_model_1.Review.find();
});
exports.getAllReviewFromDB = getAllReviewFromDB;
const getReviewByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return review_model_1.Review.find({ _id: id });
});
exports.getReviewByIdFromDB = getReviewByIdFromDB;
const createReviewFromDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = new Product(data); //User -> class  user -> instance
    yield data.save();
    return data;
});
exports.createReviewFromDB = createReviewFromDB;
const updateReviewFromDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield review_model_1.Review.updateOne({ _id: id }, { $set: data }, { new: true });
        if (result.modifiedCount === 0) {
            throw new Error("Review not found or not modified");
        }
        const updatedDocument = yield review_model_1.Review.findById(id);
        if (!updatedDocument) {
            throw new Error("Review not found");
        }
        return updatedDocument;
    }
    catch (error) {
        console.error("Error updating review:", error);
        throw error;
    }
});
exports.updateReviewFromDB = updateReviewFromDB;
