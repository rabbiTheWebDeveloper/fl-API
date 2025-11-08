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
exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const product_service_1 = require("./product.service");
const responseHandler_1 = require("../../utlis/responseHandler");
const slugify_1 = __importDefault(require("slugify"));
const product_model_1 = require("./product.model");
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
                filename: uploadResponse.fileId,
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
                    filename: uploadResponse.fileId,
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
                    image = {
                        url: uploadResponse.url,
                        filename: uploadResponse.fileId,
                    };
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
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { productId } = req.params;
        const files = req.files;
        const { productName } = req.body;
        // --- Parse deliveryCharges ---
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
        // --- Find existing product ---
        const existingProduct = yield product_model_1.ProductModel.findById(productId);
        if (!existingProduct) {
            return (0, responseHandler_1.sendApiResponse)(res, 404, false, "Product not found");
        }
        // --- Upload new main image if provided ---
        let mainImage = existingProduct.mainImage;
        if ((_a = files === null || files === void 0 ? void 0 : files.mainImage) === null || _a === void 0 ? void 0 : _a[0]) {
            const file = files.mainImage[0];
            // 🧹 Delete old image from ImageKit (if exists)
            if (mainImage === null || mainImage === void 0 ? void 0 : mainImage.filename) {
                try {
                    yield imagekit_1.default.deleteFile(mainImage.filename);
                }
                catch (err) {
                    console.warn("ImageKit main image delete failed:", err.message);
                }
            }
            const uploadResponse = yield imagekit_1.default.upload({
                file: file.buffer,
                fileName: `${(0, slugify_1.default)(productName || "product", {
                    lower: true,
                })}-${Date.now()}`,
                folder: "/products/main",
            });
            mainImage = {
                url: uploadResponse.url,
                filename: uploadResponse.fileId,
            };
        }
        // --- Upload new gallery images if provided ---
        let galleryImages = existingProduct.galleryImages || [];
        if ((_b = files === null || files === void 0 ? void 0 : files.galleryImages) === null || _b === void 0 ? void 0 : _b.length) {
            // 🧹 Delete old gallery images
            if (galleryImages.length) {
                for (const img of galleryImages) {
                    if (img.filename) {
                        try {
                            yield imagekit_1.default.deleteFile(img.filename);
                        }
                        catch (err) {
                            console.warn("ImageKit gallery delete failed:", err.message);
                        }
                    }
                }
            }
            // ✅ Upload new ones
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
                    filename: uploadResponse.fileId,
                };
            })));
        }
        // --- Update variant images ---
        let variants = existingProduct.variants || [];
        if (req.body.variants) {
            const variantData = JSON.parse(req.body.variants);
            const variantFiles = (files === null || files === void 0 ? void 0 : files.variantImages) || [];
            variants = yield Promise.all(variantData.map((v, index) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                let image = v.image || null;
                // ✅ if a new image is uploaded for this variant
                if (variantFiles[index]) {
                    // 🧹 delete old variant image
                    if ((_a = v.image) === null || _a === void 0 ? void 0 : _a.filename) {
                        try {
                            yield imagekit_1.default.deleteFile(v.image.filename);
                        }
                        catch (err) {
                            console.warn("ImageKit variant delete failed:", err.message);
                        }
                    }
                    const uploadResponse = yield imagekit_1.default.upload({
                        file: variantFiles[index].buffer,
                        fileName: `${(0, slugify_1.default)(v.productCode || "variant", {
                            lower: true,
                        })}-${Date.now()}`,
                        folder: "/products/variants",
                    });
                    image = {
                        url: uploadResponse.url,
                        filename: uploadResponse.fileId,
                    };
                }
                return Object.assign(Object.assign({}, v), { image });
            })));
        }
        // --- Update product ---
        const updatedProduct = yield product_model_1.ProductModel.findByIdAndUpdate(productId, Object.assign(Object.assign({}, req.body), { mainImage,
            deliveryCharges,
            galleryImages,
            variants }), { new: true });
        (0, responseHandler_1.sendApiResponse)(res, 200, true, updatedProduct);
    }
    catch (error) {
        console.error("Error updating product:", error);
        (0, responseHandler_1.sendApiResponse)(res, 500, false, error.message || "Internal Server Error");
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { productId } = req.params;
        // --- Find product ---
        const product = yield product_model_1.ProductModel.findById(productId);
        if (!product) {
            return (0, responseHandler_1.sendApiResponse)(res, 404, false, "Product not found");
        }
        // --- Delete main image if exists ---
        if ((_a = product.mainImage) === null || _a === void 0 ? void 0 : _a.filename) {
            try {
                yield imagekit_1.default.deleteFile(product.mainImage.filename);
            }
            catch (err) {
                console.warn("Main image not found in ImageKit:", err.message);
            }
        }
        // --- Delete gallery images ---
        if ((_b = product.galleryImages) === null || _b === void 0 ? void 0 : _b.length) {
            yield Promise.all(product.galleryImages.map((img) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield imagekit_1.default.deleteFile(img.filename);
                }
                catch (err) {
                    console.warn("Gallery image delete failed:", img.filename);
                }
            })));
        }
        // --- Delete variant images ---
        if ((_c = product.variants) === null || _c === void 0 ? void 0 : _c.length) {
            yield Promise.all(product.variants.map((variant) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                if ((_a = variant.image) === null || _a === void 0 ? void 0 : _a.filename) {
                    try {
                        yield imagekit_1.default.deleteFile(variant.image.filename);
                    }
                    catch (err) {
                        console.warn("Variant image delete failed:", variant.image.filename);
                    }
                }
            })));
        }
        // --- Delete product from DB ---
        yield product_model_1.ProductModel.findByIdAndDelete(productId);
        (0, responseHandler_1.sendApiResponse)(res, 200, true, "Product deleted successfully ✅");
    }
    catch (error) {
        console.error("Error deleting product:", error);
        (0, responseHandler_1.sendApiResponse)(res, 500, false, error.message || "Internal Server Error");
    }
});
exports.deleteProduct = deleteProduct;
