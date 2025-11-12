import mongoose, { Schema, Document, UpdateQuery } from "mongoose";
import { IProduct, IProductModel } from "./product.interface";

// Variant Schema
const variantSchema = new Schema(
  {
    combination: { type: String, required: true },
    values: { type: Map, of: String, required: true },
    image: { url: String, filename: String },
    price: { type: Number, default: 0 },
    productCode: { type: String},
    quantity: { type: Number, default: 0, min: 0 },
  },
  { _id: true }
);

// Delivery Charges
const deliveryChargesSchema = new Schema({
  dhaka: { type: Number, default: 60 },
  outsideDhaka: { type: Number, default: 120 },
  subarea: { type: Number, default: 0 },
});

// Main Product Schema
const productSchema = new Schema(
  {
    productName: { type: String, required: true, trim: true },
    productCode: { type: String, required: true, unique: true, trim: true },

    shopId: { type: Schema.Types.ObjectId, ref: "Shop", index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", index: true },

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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

// === Virtual: Total Stock ===
productSchema.virtual("totalStock").get(function (this: any) {
  return this.variants.length > 0
    ? this.variants.reduce((sum: number, v: any) => sum + (v.quantity || 0), 0)
    : this.availableQuantity;
});

// === Discount Calculator ===
const calculateDiscount = (price: number, type: "percentage" | "fixed", value: number): number =>
  type === "percentage" ? price * (1 - value / 100) : price - value;

// === Pre Save: Auto discountedPrice ===
productSchema.pre("save", function (next) {
  if (this.isModified("regularPrice") || this.isModified("discountType") || this.isModified("discountValue")) {
    this.discountedPrice = calculateDiscount(this.regularPrice, this.discountType, this.discountValue);
  }
  next();
});

// === Pre findOneAndUpdate: Recalculate on update ===
productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  if (!update) return next();

  const fields = ["regularPrice", "discountType", "discountValue"];
  const hasChange = fields.some((f) => update.$set?.[f] !== undefined || update[f] !== undefined);
  if (!hasChange) return next();

  try {
    const doc = await this.model.findOne(this.getQuery());
    if (!doc) return next();

    const rp = update.$set?.regularPrice ?? update.regularPrice ?? doc.regularPrice;
    const dt = update.$set?.discountType ?? update.discountType ?? doc.discountType;
    const dv = update.$set?.discountValue ?? update.discountValue ?? doc.discountValue;

    if (!update.$set) update.$set = {};
    update.$set.discountedPrice = calculateDiscount(rp, dt, dv);

    next();
  } catch (err:any) {
    next(err);
  }
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
export const ProductModel =
  mongoose.models.Product || mongoose.model<IProduct, IProductModel>("Product", productSchema);