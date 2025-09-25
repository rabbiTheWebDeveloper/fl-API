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
exports.productdelete = exports.updateProductFromDB = exports.createProductFromDB = exports.getProductByIdFromDB = exports.getFilterProduct = exports.getAllProductsFromDB = void 0;
const product_model_1 = require("./product.model");
const product_constant_1 = require("./product.constant");
const cloudinary_1 = __importDefault(require("../../utlis/cloudinary"));
const getAllProductsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return product_model_1.Product.find().sort({ createdAt: -1, });
});
exports.getAllProductsFromDB = getAllProductsFromDB;
const getFilterProduct = (sortBy) => __awaiter(void 0, void 0, void 0, function* () {
    const sortKey = product_constant_1.sortingOptions[sortBy] || '_id';
    const products = yield product_model_1.Product.find().sort(sortKey);
    return products;
});
exports.getFilterProduct = getFilterProduct;
const getProductByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return product_model_1.Product.find({ _id: id });
});
exports.getProductByIdFromDB = getProductByIdFromDB;
const createProductFromDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = new Product(data); //User -> class  user -> instance
    yield data.save();
    return data;
});
exports.createProductFromDB = createProductFromDB;
const updateProductFromDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.Product.updateOne({ _id: id }, { $set: data }, { new: true });
        if (result.modifiedCount === 0) {
            throw new Error("Product not found or not modified");
        }
        const updatedDocument = yield product_model_1.Product.findById(id);
        if (!updatedDocument) {
            throw new Error("Product not found");
        }
        return updatedDocument;
    }
    catch (error) {
        console.error("Error updating Product:", error);
        throw error;
    }
});
exports.updateProductFromDB = updateProductFromDB;
const productdelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productToDelete = yield product_model_1.Product.findById(id);
        if (!productToDelete) {
            throw new Error(`Product with id ${id} not found.`);
        }
        if (productToDelete.image) {
            const public_id = (_a = productToDelete.image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0]; // Extract public_id from image URL
            yield cloudinary_1.default.uploader.destroy(public_id);
        }
        const deleteResult = yield product_model_1.Product.deleteOne({ _id: id });
        return deleteResult;
    }
    catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
});
exports.productdelete = productdelete;
