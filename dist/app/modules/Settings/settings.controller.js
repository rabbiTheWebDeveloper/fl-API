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
exports.updateSettings = exports.getSettings = void 0;
const responseHandler_1 = require("../../utlis/responseHandler");
const cloudinary_1 = __importDefault(require("../../utlis/cloudinary"));
const settings_model_1 = require("./settings.model");
const settings_service_1 = require("./settings.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const getSettings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, settings_service_1.getSettingDB)();
    (0, responseHandler_1.sendApiResponse)(res, 200, true, products);
});
exports.getSettings = getSettings;
exports.updateSettings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, websiteName, metaLink, phoneNumber, whatsappNumber, facebookLink, instagramLink, youtubeLink, twitterLink, sectionName, sectionDes } = req.body;
    let logoUrl = req.body.logo;
    let favIconUrl = req.body.favIcon;
    const existingSetting = yield settings_model_1.Setting.findById("666ebddff209767f563e46a6").maxTimeMS(20000);
    if (!existingSetting) {
        return (0, responseHandler_1.sendApiResponse)(res, 404, false, "Settings not found");
    }
    if (req.files && Array.isArray(req.files)) {
        const files = req.files;
        for (const file of files) {
            const result = yield cloudinary_1.default.uploader.upload(file.path);
            if (file.fieldname === 'logo') {
                if (existingSetting.logo) {
                    // Destroy existing logo
                    const publicId = getPublicIdFromUrl(existingSetting.logo);
                    yield cloudinary_1.default.uploader.destroy(publicId);
                }
                logoUrl = result.secure_url;
            }
            else if (file.fieldname === 'favIcon') {
                if (existingSetting.favIcon) {
                    // Destroy existing favIcon
                    const publicId = getPublicIdFromUrl(existingSetting.favIcon);
                    yield cloudinary_1.default.uploader.destroy(publicId);
                }
                favIconUrl = result.secure_url;
            }
        }
    }
    const newSettings = {
        websiteName,
        metaLink,
        logo: logoUrl,
        favIcon: favIconUrl,
        phoneNumber,
        whatsappNumber,
        facebookLink,
        instagramLink,
        youtubeLink,
        twitterLink,
        sectionName,
        sectionDes
    };
    const product = yield (0, settings_service_1.updateSettingFromDB)("666ebddff209767f563e46a6", newSettings);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
}));
function getPublicIdFromUrl(url) {
    const parts = url.split('/');
    const publicIdWithExtension = parts[parts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];
    return publicId;
}
