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
exports.Categorys = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const categorysSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    shopId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
    },
    slug: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    imageFileId: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, {
    timestamps: true,
    versionKey: false,
});
categorysSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("name")) {
            const baseSlug = (0, slugify_1.default)(this.name, { lower: true, strict: true });
            // Find the slug with the highest number for this baseSlug
            const regex = new RegExp(`^${baseSlug}(-[0-9]+)?$`, "i");
            const lastSlug = yield mongoose_1.default.models.Category.findOne({ slug: regex })
                .sort({ slug: -1 }) // get the "last" one
                .select("slug");
            if (!lastSlug) {
                this.slug = baseSlug;
            }
            else {
                const match = lastSlug.slug.match(/-(\d+)$/);
                const lastNumber = match ? parseInt(match[1], 10) : 0;
                this.slug =
                    lastNumber === 0 ? `${baseSlug}-1` : `${baseSlug}-${lastNumber + 1}`;
            }
        }
        next();
    });
});
categorysSchema.pre("updateOne", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const update = this.getUpdate();
        if (update.name) {
            const baseSlug = (0, slugify_1.default)(update.name, { lower: true, strict: true });
            const regex = new RegExp(`^${baseSlug}(-[0-9]+)?$`, "i");
            const lastSlug = yield mongoose_1.default.models.Category.findOne({ slug: regex })
                .sort({ slug: -1 })
                .select("slug");
            if (!lastSlug) {
                update.slug = baseSlug;
            }
            else {
                const match = lastSlug.slug.match(/-(\d+)$/);
                const lastNumber = match ? parseInt(match[1], 10) : 0;
                update.slug =
                    lastNumber === 0 ? `${baseSlug}-1` : `${baseSlug}-${lastNumber + 1}`;
            }
            this.setUpdate(update);
        }
        next();
    });
});
exports.Categorys = mongoose_1.default.model("Category", categorysSchema);
