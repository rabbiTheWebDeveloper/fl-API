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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDateFilter = exports.getAllOrderSummarizeFromDB = exports.updateOrderTrackingIDFromDB = exports.updateOrderStatusFromDB = exports.createOrderFromDB = exports.getOrderBySearch = exports.getOrderByStatus = exports.getOrderByIdFromDB = exports.getOrdersWithCustomerDetails = exports.getRecentOrderFromDB = exports.getAllOrderFromDB = void 0;
const order_model_1 = require("./order.model");
const getAllOrderFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return order_model_1.OrderModel.aggregate([
        {
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "productDetails",
            },
        },
        {
            $sort: {
                createdAt: -1, // Sort by the createdAt field in descending order
            },
        },
    ]);
});
exports.getAllOrderFromDB = getAllOrderFromDB;
const getRecentOrderFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recentOrders = yield order_model_1.OrderModel.find().sort({ _id: -1 }).limit(6);
        return recentOrders;
    }
    catch (error) {
        console.error("Error fetching recent orders:", error);
        throw error;
    }
});
exports.getRecentOrderFromDB = getRecentOrderFromDB;
const getOrdersWithCustomerDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch orders
        const orders = yield order_model_1.OrderModel.find().sort({ _id: -1 }).limit(6);
        // Map the orders and include customer details
        const ordersWithCustomerDetails = orders.map((order) => {
            const _a = order.toObject(), { name: name, phoneNumber: customerPhone, address: customerAddress } = _a, orderDetails = __rest(_a, ["name", "phoneNumber", "address"]);
            return {
                // ...orderDetails,
                name,
                customerPhone,
                customerAddress,
                createdAt: order.createdAt,
            };
        });
        return ordersWithCustomerDetails;
    }
    catch (error) {
        console.error("Error fetching orders with customer details:", error);
        throw error;
    }
});
exports.getOrdersWithCustomerDetails = getOrdersWithCustomerDetails;
const getOrderByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return order_model_1.OrderModel.find({ _id: id });
});
exports.getOrderByIdFromDB = getOrderByIdFromDB;
const getOrderByStatus = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return order_model_1.OrderModel.find({ status: data });
});
exports.getOrderByStatus = getOrderByStatus;
const getOrderBySearch = (param) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = order_model_1.OrderModel.find({
            $or: [
                { tracking_ID: `/${param}/` },
                { name: `/${param}/` },
                { phoneNumber: `/${param}/` },
                { _id: `/${param}/` },
                { status: `/${param}/` },
            ],
        });
        return orders;
    }
    catch (error) {
        console.error(error);
        throw new Error('An error occurred while searching for orders.');
    }
});
exports.getOrderBySearch = getOrderBySearch;
const createOrderFromDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new order_model_1.OrderModel(data); //User -> class  user -> instance
    yield user.save();
    return user;
});
exports.createOrderFromDB = createOrderFromDB;
const updateOrderStatusFromDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updateStatus = yield order_model_1.OrderModel.findByIdAndUpdate({ _id: id }, { status: data }, {
        new: true,
    });
    return updateStatus;
});
exports.updateOrderStatusFromDB = updateOrderStatusFromDB;
const updateOrderTrackingIDFromDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updateStatus = yield order_model_1.OrderModel.findByIdAndUpdate({ _id: id }, { tracking_ID: data }, {
        new: true,
    });
    return updateStatus;
});
exports.updateOrderTrackingIDFromDB = updateOrderTrackingIDFromDB;
const getAllOrderSummarizeFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return order_model_1.OrderModel.aggregate([
        {
            $facet: {
                statusCounts: [
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 },
                        },
                    },
                ],
                TotalPrices: [
                    {
                        $group: {
                            _id: null,
                            totalPriceSum: { $sum: "$totall_price" },
                        },
                    },
                ],
                TotallOrder: [
                    {
                        $group: {
                            _id: null,
                            totalOrder: { $sum: 1 },
                        },
                    },
                ],
                TotallCustomer: [
                    {
                        $group: {
                            _id: "$phoneNumber",
                            count: { $sum: 1 }, // Count the number of occurrences of each phoneNumber
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            TotallCustomer: { $sum: 1 }, // Count the number of unique phone numbers
                        },
                    },
                ],
            },
        },
    ]);
});
exports.getAllOrderSummarizeFromDB = getAllOrderSummarizeFromDB;
const orderDateFilter = (selectedFilter) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [];
    // Define date filters
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const last7DaysStart = new Date();
    last7DaysStart.setDate(last7DaysStart.getDate() - 7);
    last7DaysStart.setHours(0, 0, 0, 0);
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setHours(0, 0, 0, 0);
    // Apply the selected filter based on user input
    if (selectedFilter === "Today") {
        pipeline.push({
            $match: {
                createdAt: {
                    $gte: todayStart,
                    $lte: todayEnd,
                },
            },
        });
    }
    else if (selectedFilter === "Last 7 Days") {
        pipeline.push({
            $match: {
                createdAt: {
                    $gte: last7DaysStart,
                    $lte: todayEnd,
                },
            },
        });
    }
    else if (selectedFilter === "Last Month") {
        pipeline.push({
            $match: {
                createdAt: {
                    $gte: lastMonthStart,
                    $lte: todayEnd,
                },
            },
        });
    }
    // Perform the aggregation using Mongoose
    const result = yield order_model_1.OrderModel.aggregate(pipeline);
    return result;
});
exports.orderDateFilter = orderDateFilter;
