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
exports.userUpdate = exports.login = exports.registration = void 0;
const responseHandler_1 = require("../../utlis/responseHandler");
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const jwt = require("jsonwebtoken");
exports.registration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const product = yield (0, user_service_1.registrationFromDB)(reqBody);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
}));
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const data = yield (0, user_service_1.loginFromDB)(reqBody);
    if ((data === null || data === void 0 ? void 0 : data.length) > 0) {
        let Payload = { exp: Math.floor(Date.now() / 1000) + (50 * 24 * 60 * 60), data: data[0]['email'] };
        let token = jwt.sign(Payload, 'SecretKey123456789');
        res.status(200).json({ status: "success", token: token, data: data[0] });
    }
    else {
        res.status(401).json({ status: "unauthorized" });
    }
    // }
});
exports.login = login;
const userUpdate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const id = req.params.id;
    const product = yield (0, user_service_1.userUpdateInDB)(id, reqBody);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.userUpdate = userUpdate;
