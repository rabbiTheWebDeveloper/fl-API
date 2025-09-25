"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_controller_1 = require("./settings.controller");
const imageUpload_1 = __importDefault(require("../../middleware/imageUpload"));
const router = (0, express_1.Router)();
router.get("/settings", settings_controller_1.getSettings);
router.post('/setting-update', imageUpload_1.default.any(), settings_controller_1.updateSettings);
exports.default = router;
