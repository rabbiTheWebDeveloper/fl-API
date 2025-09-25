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
exports.updateSettingFromDB = exports.createSettingFromDB = exports.getSettingDB = void 0;
const settings_model_1 = require("./settings.model");
;
const getSettingDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return settings_model_1.Setting.find();
});
exports.getSettingDB = getSettingDB;
const createSettingFromDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const setting = new settings_model_1.Setting(data); // Ensure 'data' is used to create an instance of the Mongoose model
    yield setting.save();
    return setting;
});
exports.createSettingFromDB = createSettingFromDB;
const updateSettingFromDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield settings_model_1.Setting.updateOne({ _id: id }, { $set: data }, { new: true });
        if (result.modifiedCount === 0) {
            throw new Error("Product not found or not modified");
        }
        const updatedDocument = yield settings_model_1.Setting.findById(id);
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
exports.updateSettingFromDB = updateSettingFromDB;
