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
exports.updateCategory = exports.addCategory = exports.deleteCategory = exports.getCategorysByID = exports.getCategorys = void 0;
const responseHandler_1 = require("../../utlis/responseHandler");
const category_service_1 = require("./category.service");
const mongoose_1 = __importDefault(require("mongoose"));
const express_validator_1 = require("express-validator");
const getCategorys = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, category_service_1.getCategoryDB)();
    (0, responseHandler_1.sendApiResponse)(res, 200, true, products);
});
exports.getCategorys = getCategorys;
const getCategorysByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const products = yield (0, category_service_1.getCategoryByIdDB)(id);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, products);
});
exports.getCategorysByID = getCategorysByID;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate the 'id' parameter (you can use mongoose.Types.ObjectId.isValid())
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid category ID' });
        }
        // Delete the category using categorydeleteService
        const products = yield (0, category_service_1.categorydeleteService)(id);
        // Send a success response with 204 No Content status
        res.status(204).send();
    }
    catch (error) {
        // Handle errors gracefully
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.deleteCategory = deleteCategory;
const addCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const product = yield (0, category_service_1.createCategoryFromDB)(payload);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.addCategory = addCategory;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = req.body;
        // Validate the request payload
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Update the category using categoryService
        const updatedCategory = yield (0, category_service_1.updateCategoryFromDB)(id, payload);
        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        // Send a success response with the updated category
        res.status(200).json({ success: true, data: updatedCategory });
    }
    catch (error) {
        // Handle errors gracefully
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.updateCategory = updateCategory;
