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
const product_model_1 = require("../modules/Product/product.model");
// Function to generate Arabic slugs
const generateArabicSlug = (title) => __awaiter(void 0, void 0, void 0, function* () {
    // Normalize Arabic characters
    const normalizedTitle = title
        .replace(/[^\u0621-\u064Aa-zA-Z0-9\s]/g, '') // Remove non-Arabic characters except numbers and spaces
        .replace(/\s+/g, '-') // Replace spaces with dash
        .toLowerCase(); // Convert to lowercase
    // Check if the slug already exists in the database
    let titleSlug = normalizedTitle;
    let existingProduct = yield product_model_1.Product.findOne({ titleSlug });
    let slugCounter = 1;
    while (existingProduct) {
        // Append counter to the slug and check again
        titleSlug = `${normalizedTitle}-${slugCounter}`;
        existingProduct = yield product_model_1.Product.findOne({ titleSlug });
        slugCounter++;
    }
    return titleSlug;
});
exports.default = generateArabicSlug;
