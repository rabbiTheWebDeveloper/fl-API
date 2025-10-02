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
exports.ProductModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const variantSchema = new mongoose_1.default.Schema({
    combination: {
        type: String,
        required: true,
    },
    values: {
        type: Map,
        of: String,
        required: true,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        default: 0,
    },
    productCode: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    description: String,
}, { _id: true });
const deliveryChargesSchema = new mongoose_1.default.Schema({
    dhaka: {
        type: Number,
        default: 0,
    },
    outsideDhaka: {
        type: Number,
        default: 0,
    },
    subarea: {
        type: Number,
        default: 0,
    },
});
const productSchema = new mongoose_1.default.Schema({
    // Basic Information
    productName: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
    },
    productCode: {
        type: String,
        required: [true, "Product code is required"],
        // unique: true,
        trim: true,
    },
    shopId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Shop",
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
    },
    availableQuantity: {
        type: Number,
        default: 0,
        min: 0,
    },
    shortDescription: {
        type: String,
        trim: true,
    },
    longDescription: {
        type: String,
        trim: true,
    },
    // Pricing Information
    regularPrice: {
        type: Number,
        required: [true, "Regular price is required"],
        min: 0,
    },
    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
    },
    discountValue: {
        type: Number,
        default: 0,
        min: 0,
    },
    discountedPrice: {
        type: Number,
        min: 0,
    },
    // Delivery Settings
    deliveryCharge: {
        type: String,
        enum: ["free", "paid"],
        default: "free",
    },
    deliveryCharges: deliveryChargesSchema,
    // Media
    mainImage: {
        url: String,
        filename: String,
    },
    galleryImages: [
        {
            url: String,
            filename: String,
            position: Number,
        },
    ],
    // Variants System
    variants: [variantSchema],
    variantConfig: {
        variantType1: {
            type: String,
            enum: ["size", "color", "material", ""],
            default: "",
        },
        variantType2: {
            type: String,
            enum: ["size", "color", "material", "none", ""],
            default: "",
        },
        selectedOptions1: [String],
        selectedOptions2: [String],
    },
    // SEO & Status
    metaTitle: {
        type: String,
        trim: true,
    },
    metaDescription: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
});
// Virtual for calculating discounted price
productSchema.virtual("calculatedDiscountPrice").get(function () {
    if (this.discountType === "percentage") {
        return this.regularPrice - (this.regularPrice * this.discountValue) / 100;
    }
    else {
        return this.regularPrice - this.discountValue;
    }
});
// Pre-save middleware to calculate discounted price
productSchema.pre("save", function (next) {
    if (this.isModified("regularPrice") ||
        this.isModified("discountType") ||
        this.isModified("discountValue")) {
        this.discountedPrice = this.get("calculatedDiscountPrice");
    }
    next();
});
// Indexes for better query performance
productSchema.index({ productCode: 1 });
productSchema.index({ categoryName: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ "variants.productCode": 1 });
productSchema.index({ createdAt: -1 });
// Static method to find active products
productSchema.statics.findActive = function () {
    return this.find({ isActive: true });
};
// Instance method to check if product is in stock
productSchema.methods.isInStock = function () {
    if (this.variants.length > 0) {
        return this.variants.some((variant) => variant.quantity > 0);
    }
    return this.availableQuantity > 0;
};
// Instance method to get total stock
productSchema.methods.getTotalStock = function () {
    if (this.variants.length > 0) {
        return this.variants.reduce((total, variant) => total + variant.quantity, 0);
    }
    return this.availableQuantity;
};
exports.ProductModel = mongoose_1.default.models.Product ||
    mongoose_1.default.model("Product", productSchema);
