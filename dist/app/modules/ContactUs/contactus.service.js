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
exports.createContractFromDB = exports.getProductByIdFromDB = exports.getAllProductsFromDB = void 0;
const contactus_model_1 = require("./contactus.model");
const getAllProductsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return contactus_model_1.Contact.find();
});
exports.getAllProductsFromDB = getAllProductsFromDB;
const getProductByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return contactus_model_1.Contact.find({ _id: id });
});
exports.getProductByIdFromDB = getProductByIdFromDB;
const createContractFromDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new contactus_model_1.Contact(data); //User -> class  user -> instance
    yield user.save();
    return user;
});
exports.createContractFromDB = createContractFromDB;
