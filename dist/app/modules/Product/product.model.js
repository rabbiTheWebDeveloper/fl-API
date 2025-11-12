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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ProductModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Variant Schema
const variantSchema = new mongoose_1.Schema({
    combination: { type: String, required: true },
    values: { type: Map, of: String, required: true },
    image: { url: String, filename: String },
    price: { type: Number, default: 0 },
    productCode: { type: String },
    quantity: { type: Number, default: 0, min: 0 },
}, { _id: true });
// Delivery Charges
const deliveryChargesSchema = new mongoose_1.Schema({
    dhaka: { type: Number, default: 60 },
    outsideDhaka: { type: Number, default: 120 },
    subarea: { type: Number, default: 0 },
});
// Main Product Schema
const productSchema = new mongoose_1.Schema({
    productName: { type: String, required: true, trim: true },
    productCode: { type: String, required: true, unique: true, trim: true },
    shopId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Shop", index: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", index: true },
    availableQuantity: { type: Number, default: 0, min: 0 },
    shortDescription: { type: String, trim: true },
    longDescription: { type: String, trim: true },
    // Pricing
    regularPrice: { type: Number, required: true, min: 0 },
    discountType: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    discountValue: { type: Number, default: 0, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    // Delivery
    deliveryCharge: { type: String, enum: ["free", "paid"], default: "free" },
    deliveryCharges: deliveryChargesSchema,
    // Media
    mainImage: { url: String, filename: String },
    galleryImages: [{ url: String, filename: String, position: Number }],
    // Variants
    variants: [variantSchema],
    variantConfig: {
        variantType1: { type: String, enum: ["size", "color", "material", ""], default: "" },
        variantType2: { type: String, enum: ["size", "color", "material", "none", ""], default: "" },
        selectedOptions1: [String],
        selectedOptions2: [String],
    },
    // SEO & Status
    metaTitle: String,
    metaDescription: String,
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
});
// === Virtual: Total Stock ===
productSchema.virtual("totalStock").get(function () {
    return this.variants.length > 0
        ? this.variants.reduce((sum, v) => sum + (v.quantity || 0), 0)
        : this.availableQuantity;
});
// === Discount Calculator ===
const calculateDiscount = (price, type, value) => type === "percentage" ? price * (1 - value / 100) : price - value;
// === Pre Save: Auto discountedPrice ===
productSchema.pre("save", function (next) {
    if (this.isModified("regularPrice") || this.isModified("discountType") || this.isModified("discountValue")) {
        this.discountedPrice = calculateDiscount(this.regularPrice, this.discountType, this.discountValue);
    }
    next();
});
// === Pre findOneAndUpdate: Recalculate on update ===
productSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const update = this.getUpdate();
        if (!update)
            return next();
        const fields = ["regularPrice", "discountType", "discountValue"];
        const hasChange = fields.some((f) => { var _a; return ((_a = update.$set) === null || _a === void 0 ? void 0 : _a[f]) !== undefined || update[f] !== undefined; });
        if (!hasChange)
            return next();
        try {
            const doc = yield this.model.findOne(this.getQuery());
            if (!doc)
                return next();
            const rp = (_c = (_b = (_a = update.$set) === null || _a === void 0 ? void 0 : _a.regularPrice) !== null && _b !== void 0 ? _b : update.regularPrice) !== null && _c !== void 0 ? _c : doc.regularPrice;
            const dt = (_f = (_e = (_d = update.$set) === null || _d === void 0 ? void 0 : _d.discountType) !== null && _e !== void 0 ? _e : update.discountType) !== null && _f !== void 0 ? _f : doc.discountType;
            const dv = (_j = (_h = (_g = update.$set) === null || _g === void 0 ? void 0 : _g.discountValue) !== null && _h !== void 0 ? _h : update.discountValue) !== null && _j !== void 0 ? _j : doc.discountValue;
            if (!update.$set)
                update.$set = {};
            update.$set.discountedPrice = calculateDiscount(rp, dt, dv);
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
// === Indexes (O(1) & O(log n)) ===
productSchema.index({ productCode: 1 }); // O(1)
productSchema.index({ "variants.productCode": 1 }, { unique: true, sparse: true }); // O(1)
productSchema.index({ shopId: 1, isActive: 1 }); // O(log n)
productSchema.index({ categoryId: 1, isActive: 1 }); // O(log n)
productSchema.index({ createdAt: -1 }); // O(log n + k)
// === Static: Active Products ===
productSchema.statics.findActive = function () {
    return this.find({ isActive: true });
};
// === Method: In Stock? ===
productSchema.methods.isInStock = function () {
    return this.totalStock > 0;
};
// === Export ===
exports.ProductModel = mongoose_1.default.models.Product || mongoose_1.default.model("Product", productSchema);
