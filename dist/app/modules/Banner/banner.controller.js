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
exports.createBanner = void 0;
const banner_service_1 = require("./banner.service");
const responseHandler_1 = require("../../utlis/responseHandler");
const banner_model_1 = require("./banner.model");
const createBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url, userId, shopId } = req.body;
        let uploadedImage = null;
        // upload image if provided
        if (req.file) {
            uploadedImage = yield (0, banner_service_1.uploadBannerImage)(req.file);
        }
        // check if banner exists
        let existingBanner = yield (0, banner_service_1.findBannerByUserAndShop)(userId, shopId);
        if (existingBanner) {
            // update banner
            const updatedBanner = yield (0, banner_service_1.updateBannerImages)(existingBanner, uploadedImage, url);
            return (0, responseHandler_1.sendApiResponse)(res, 200, true, updatedBanner);
        }
        else {
            // create new banner
            const newBanner = new banner_model_1.Banner({
                url,
                userId,
                shopId,
                images: uploadedImage ? [uploadedImage] : [],
            });
            const banner = yield (0, banner_service_1.createBannerFromDB)(newBanner);
            return (0, responseHandler_1.sendApiResponse)(res, 200, true, banner);
        }
    }
    catch (error) {
        console.error("Banner create error:", error);
        next(error);
    }
});
exports.createBanner = createBanner;
