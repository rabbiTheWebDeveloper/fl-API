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
exports.updateBannerImages = exports.deleteBannerImage = exports.uploadBannerImage = exports.findBannerByUserAndShop = exports.createBannerFromDB = void 0;
const imagekit_1 = __importDefault(require("../../utlis/imagekit"));
const banner_model_1 = require("./banner.model");
// Create new banner
const createBannerFromDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield data.save();
    return data;
});
exports.createBannerFromDB = createBannerFromDB;
// Find banner by user + shop
const findBannerByUserAndShop = (userId, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield banner_model_1.Banner.findOne({ userId, shopId });
});
exports.findBannerByUserAndShop = findBannerByUserAndShop;
// Upload image to ImageKit
const uploadBannerImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadResponse = yield imagekit_1.default.upload({
        file: file.buffer,
        fileName: `banner-${Date.now()}`,
        folder: "/banners/main",
    });
    return {
        url: uploadResponse.url,
        filename: uploadResponse.fileId,
    };
});
exports.uploadBannerImage = uploadBannerImage;
// Delete image from ImageKit
const deleteBannerImage = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield imagekit_1.default.deleteFile(filename);
    }
    catch (err) {
        console.log("Image delete failed:", err.message);
    }
});
exports.deleteBannerImage = deleteBannerImage;
// Update existing banner (images, url, etc.)
const updateBannerImages = (banner, newImage, url) => __awaiter(void 0, void 0, void 0, function* () {
    let images = banner.images || [];
    if (newImage) {
        images.push(newImage);
    }
    // keep only latest 3 images
    if (images.length > 3) {
        const removedImages = images.slice(0, images.length - 3);
        // delete old images from ImageKit
        for (const img of removedImages) {
            yield (0, exports.deleteBannerImage)(img.filename);
        }
        // keep latest 3
        images = images.slice(-3);
    }
    banner.images = images;
    banner.url = url || banner.url;
    yield banner.save();
    return banner;
});
exports.updateBannerImages = updateBannerImages;
