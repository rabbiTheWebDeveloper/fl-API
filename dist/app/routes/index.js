"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_router_1 = __importDefault(require("../modules/Category/category.router"));
const product_router_1 = __importDefault(require("../modules/Product/product.router"));
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/product",
        route: product_router_1.default,
    },
    {
        path: "/category",
        route: category_router_1.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
