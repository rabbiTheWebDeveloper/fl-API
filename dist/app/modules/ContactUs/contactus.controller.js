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
exports.createContract = exports.getContactById = exports.getAllContact = void 0;
const contactus_service_1 = require("./contactus.service");
const responseHandler_1 = require("../../utlis/responseHandler");
const getAllContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, contactus_service_1.getAllProductsFromDB)();
    (0, responseHandler_1.sendApiResponse)(res, 200, true, products);
});
exports.getAllContact = getAllContact;
const getContactById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield (0, contactus_service_1.getProductByIdFromDB)(id);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.getContactById = getContactById;
const createContract = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const product = yield (0, contactus_service_1.createContractFromDB)(data);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.createContract = createContract;
