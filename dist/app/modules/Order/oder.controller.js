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
exports.getAllOrderFilterDates = exports.getAllOrderSummarize = exports.updateOrderTraking = exports.updateOrderStatus = exports.createOrder = exports.getOrderByOrderSearch = exports.getOrderByOrderStatus = exports.getOrderById = exports.getCustomerList = exports.getRecentOrder = exports.getAllOrder = void 0;
const responseHandler_1 = require("../../utlis/responseHandler");
const order_service_1 = require("./order.service");
const getAllOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, order_service_1.getAllOrderFromDB)();
    (0, responseHandler_1.sendApiResponse)(res, 200, true, products);
});
exports.getAllOrder = getAllOrder;
const getRecentOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, order_service_1.getRecentOrderFromDB)();
    (0, responseHandler_1.sendApiResponse)(res, 200, true, products);
});
exports.getRecentOrder = getRecentOrder;
const getCustomerList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, order_service_1.getOrdersWithCustomerDetails)();
    (0, responseHandler_1.sendApiResponse)(res, 200, true, products);
});
exports.getCustomerList = getCustomerList;
const getOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield (0, order_service_1.getOrderByIdFromDB)(id);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.getOrderById = getOrderById;
const getOrderByOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.params;
    const product = yield (0, order_service_1.getOrderByStatus)(status);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.getOrderByOrderStatus = getOrderByOrderStatus;
const getOrderByOrderSearch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.params;
    const product = yield (0, order_service_1.getOrderBySearch)(search);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.getOrderByOrderSearch = getOrderByOrderSearch;
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const product = yield (0, order_service_1.createOrderFromDB)(data);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.createOrder = createOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const id = (req.params.id);
        const product = yield (0, order_service_1.updateOrderStatusFromDB)(id, status);
        (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateOrderStatus = updateOrderStatus;
const updateOrderTraking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tracking_ID } = req.body;
        const id = (req.params.id);
        const product = yield (0, order_service_1.updateOrderTrackingIDFromDB)(id, tracking_ID);
        (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateOrderTraking = updateOrderTraking;
const getAllOrderSummarize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, order_service_1.getAllOrderSummarizeFromDB)();
    (0, responseHandler_1.sendApiResponse)(res, 200, true, products);
});
exports.getAllOrderSummarize = getAllOrderSummarize;
const getAllOrderFilterDates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.params;
    const product = yield (0, order_service_1.orderDateFilter)(date);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
});
exports.getAllOrderFilterDates = getAllOrderFilterDates;
