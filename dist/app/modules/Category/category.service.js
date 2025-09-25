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
exports.categorydeleteService = exports.updateCategoryFromDB = exports.createCategoryFromDB = exports.getCategoryByIdDB = exports.getCategoryDB = void 0;
const category_model_1 = require("./category.model");
const getCategoryDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return category_model_1.Categorys.find().sort({ createdAt: -1, });
});
exports.getCategoryDB = getCategoryDB;
const getCategoryByIdDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return category_model_1.Categorys.find({ _id: id });
});
exports.getCategoryByIdDB = getCategoryByIdDB;
const createCategoryFromDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new category_model_1.Categorys(data);
    yield user.save();
    return user;
});
exports.createCategoryFromDB = createCategoryFromDB;
const updateCategoryFromDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield category_model_1.Categorys.updateOne({ _id: id }, data);
    return result;
});
exports.updateCategoryFromDB = updateCategoryFromDB;
const categorydeleteService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return category_model_1.Categorys.deleteOne({ _id: id });
});
exports.categorydeleteService = categorydeleteService;
