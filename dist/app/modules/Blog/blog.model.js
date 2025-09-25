"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blogs = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const blogSchema = new mongoose_1.Schema({
    blog_title: {
        type: String,
        required: true,
    },
    blog_name: {
        type: String,
        required: true,
    },
    blog_category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    image: String,
    // sku: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
}, {
    timestamps: true,
    versionKey: false
});
exports.Blogs = mongoose_1.default.model("blogs", blogSchema);
