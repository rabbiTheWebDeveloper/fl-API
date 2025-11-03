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
exports.updateShopInfoController = void 0;
const shopInfo_service_1 = require("./shopInfo.service");
const responseHandler_1 = require("../../utlis/responseHandler");
const slugify_1 = __importDefault(require("slugify"));
const imagekit_1 = __importDefault(require("../../utlis/imagekit"));
const shopInfo_model_1 = require("./shopInfo.model");
const updateShopInfoController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { shopId, userId } = req.body;
        const files = req.files;
        if (!shopId || !userId) {
            return (0, responseHandler_1.sendApiResponse)(res, 400, false, "Shop ID and User ID are required");
        }
        // --- Get existing shop info ---
        const existingShopInfo = yield shopInfo_model_1.ShopInfoModel.findOne({ shopId, userId });
        // --- Handle company logo upload ---
        let companyLogo = (existingShopInfo === null || existingShopInfo === void 0 ? void 0 : existingShopInfo.companyLogo) || null;
        if ((_a = files === null || files === void 0 ? void 0 : files.companyLogo) === null || _a === void 0 ? void 0 : _a[0]) {
            // 🧹 Delete old company logo if exists
            if ((_b = existingShopInfo === null || existingShopInfo === void 0 ? void 0 : existingShopInfo.companyLogo) === null || _b === void 0 ? void 0 : _b.publicId) {
                try {
                    yield imagekit_1.default.deleteFile(existingShopInfo.companyLogo.publicId);
                }
                catch (err) {
                    console.warn("⚠️ Error deleting old logo:", err.message);
                }
            }
            // 📤 Upload new logo
            const file = files.companyLogo[0];
            const uploadResponse = yield imagekit_1.default.upload({
                file: file.buffer,
                fileName: `${(0, slugify_1.default)("company-logo", { lower: true })}-${Date.now()}`,
                folder: "/mersent/main",
            });
            companyLogo = {
                url: uploadResponse.url,
                publicId: uploadResponse.fileId, // use `fileId` (ImageKit’s unique ID)
            };
        }
        // --- Handle favicon upload ---
        let favicon = (existingShopInfo === null || existingShopInfo === void 0 ? void 0 : existingShopInfo.favicon) || null;
        if ((_c = files === null || files === void 0 ? void 0 : files.favicon) === null || _c === void 0 ? void 0 : _c[0]) {
            // 🧹 Delete old favicon if exists
            if ((_d = existingShopInfo === null || existingShopInfo === void 0 ? void 0 : existingShopInfo.favicon) === null || _d === void 0 ? void 0 : _d.publicId) {
                try {
                    yield imagekit_1.default.deleteFile(existingShopInfo.favicon.publicId);
                }
                catch (err) {
                    console.warn("⚠️ Error deleting old favicon:", err.message);
                }
            }
            // 📤 Upload new favicon
            const file = files.favicon[0];
            const uploadResponse = yield imagekit_1.default.upload({
                file: file.buffer,
                fileName: `${(0, slugify_1.default)("favicon", { lower: true })}-${Date.now()}`,
                folder: "/mersent/main",
            });
            favicon = {
                url: uploadResponse.url,
                publicId: uploadResponse.fileId,
            };
        }
        // --- Prepare payload for DB update ---
        const payload = Object.assign(Object.assign({}, req.body), { companyLogo,
            favicon });
        // --- Update database ---
        const updatedInfo = yield (0, shopInfo_service_1.updateShopInfoFromDB)(payload);
        (0, responseHandler_1.sendApiResponse)(res, 200, true, updatedInfo);
    }
    catch (error) {
        console.error("❌ Error in updateShopInfoController:", error);
        (0, responseHandler_1.sendApiResponse)(res, 500, false, error.message || "Internal Server Error");
    }
});
exports.updateShopInfoController = updateShopInfoController;
