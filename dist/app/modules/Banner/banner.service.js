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
exports.bannerdelete = exports.createBannerFromDB = exports.getAllBannerFromDB = void 0;
const cloudinary_1 = __importDefault(require("../../utlis/cloudinary"));
const banner_model_1 = require("./banner.model");
const getAllBannerFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return banner_model_1.Banner.find().sort({ createdAt: -1, });
});
exports.getAllBannerFromDB = getAllBannerFromDB;
const createBannerFromDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield data.save();
    return data;
});
exports.createBannerFromDB = createBannerFromDB;
const bannerdelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const existingBanner = yield banner_model_1.Banner.findById(id);
        if (!existingBanner) {
            throw new Error(`Banner with id ${id} not found`);
        }
        if (existingBanner.image) {
            const publicId = (_a = existingBanner.image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
            if (publicId) {
                yield cloudinary_1.default.uploader.destroy(publicId);
            }
            else {
                console.warn(`Failed to extract publicId from image URL: ${existingBanner.image}`);
            }
        }
        return yield banner_model_1.Banner.deleteOne({ _id: id });
    }
    catch (error) {
        console.error(`Failed to delete banner with id ${id}:`, error);
        throw error;
    }
});
exports.bannerdelete = bannerdelete;
