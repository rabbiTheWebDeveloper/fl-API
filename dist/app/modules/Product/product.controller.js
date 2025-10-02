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
exports.createProduct = void 0;
const product_service_1 = require("./product.service");
const responseHandler_1 = require("../../utlis/responseHandler");
const slugify_1 = __importDefault(require("slugify"));
const imagekit_1 = __importDefault(require("../../utlis/imagekit"));
slugify_1.default.extend({
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
});
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const files = req.files;
        const { productName } = req.body;
        let deliveryCharges = undefined;
        if (req.body.deliveryCharges) {
            try {
                deliveryCharges = JSON.parse(req.body.deliveryCharges);
            }
            catch (err) {
                console.error("Invalid deliveryCharges JSON:", err);
                return (0, responseHandler_1.sendApiResponse)(res, 400, false, "Invalid deliveryCharges format");
            }
        }
        // --- Upload mainImage ---
        let mainImage = null;
        if ((_a = files === null || files === void 0 ? void 0 : files.mainImage) === null || _a === void 0 ? void 0 : _a[0]) {
            const file = files.mainImage[0];
            const uploadResponse = yield imagekit_1.default.upload({
                file: file.buffer,
                fileName: `${(0, slugify_1.default)(productName || "product", {
                    lower: true,
                })}-${Date.now()}`,
                folder: "/products/main",
            });
            mainImage = {
                url: uploadResponse.url,
                filename: uploadResponse.name,
            };
        }
        // --- Upload galleryImages ---
        let galleryImages = [];
        if ((_b = files === null || files === void 0 ? void 0 : files.galleryImages) === null || _b === void 0 ? void 0 : _b.length) {
            galleryImages = yield Promise.all(files.galleryImages.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const uploadResponse = yield imagekit_1.default.upload({
                    file: file.buffer,
                    fileName: `${(0, slugify_1.default)(productName || "gallery", {
                        lower: true,
                    })}-${Date.now()}`,
                    folder: "/products/gallery",
                });
                return {
                    url: uploadResponse.url,
                    filename: uploadResponse.name,
                };
            })));
        }
        // --- Upload variantImages ---
        let variants = [];
        if (req.body.variants) {
            const variantData = JSON.parse(req.body.variants); // expects JSON string from frontend
            const variantFiles = (files === null || files === void 0 ? void 0 : files.variantImages) || [];
            variants = yield Promise.all(variantData.map((v, index) => __awaiter(void 0, void 0, void 0, function* () {
                let image = null;
                if (variantFiles[index]) {
                    const uploadResponse = yield imagekit_1.default.upload({
                        file: variantFiles[index].buffer,
                        fileName: `${(0, slugify_1.default)(v.productCode || "variant", {
                            lower: true,
                        })}-${Date.now()}`,
                        folder: "/products/variants",
                    });
                    image = { url: uploadResponse.url, filename: uploadResponse.name };
                }
                return Object.assign(Object.assign({}, v), { image });
            })));
        }
        // --- Create product in DB ---
        const product = yield (0, product_service_1.createProductFromDB)(Object.assign(Object.assign({}, req.body), { mainImage,
            deliveryCharges,
            galleryImages,
            variants }));
        (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
    }
    catch (error) {
        console.error("An error occurred:", error);
        (0, responseHandler_1.sendApiResponse)(res, 500, false, error.message || "Internal Server Error");
    }
});
exports.createProduct = createProduct;
