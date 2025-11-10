import mongoose, { Schema } from "mongoose";
import { IProduct, IProductModel } from "./product.interface";
import { UpdateQuery } from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    combination: {
      type: String,
      // required: true,
    },
    values: {
      type: Map,
      of: String,
      // required: true,
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
      // required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    description: String,
  },
  { _id: true }
);

const deliveryChargesSchema = new mongoose.Schema({
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

const productSchema = new mongoose.Schema(
  {
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
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

// Virtual for calculating discounted price
productSchema.virtual("calculatedDiscountPrice").get(function () {
  if (this.discountType === "percentage") {
    return this.regularPrice - (this.regularPrice * this.discountValue) / 100;
  } else {
    return this.regularPrice - this.discountValue;
  }
});

// Pre-save middleware to calculate discounted price
productSchema.pre("save", function (next) {
  if (
    this.isModified("regularPrice") ||
    this.isModified("discountType") ||
    this.isModified("discountValue")
  ) {
    this.discountedPrice = this.get("calculatedDiscountPrice");
  }
  next();
});



productSchema.pre("updateOne", async function (next) {
  // Type cast safely
  const update = this.getUpdate() as UpdateQuery<IProduct> | undefined;
  if (!update) return next();

  // Ensure $set exists
  if (!update.$set) update.$set = {} as any;

  // Fetch the existing product
  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return next();

  // Get values (prefer update values, fallback to doc)
  const regularPrice = update.$set.regularPrice ?? doc.regularPrice;
  const discountType = update.$set.discountType ?? doc.discountType;
  const discountValue = update.$set.discountValue ?? doc.discountValue;

  // Calculate discounted price
  let discountedPrice = regularPrice;
  if (discountType === "percentage") {
    discountedPrice = regularPrice - (regularPrice * discountValue) / 100;
  } else if (discountType === "fixed") {
    discountedPrice = regularPrice - discountValue;
  }

  // Set discounted price
  update.$set.discountedPrice = discountedPrice;

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
    return this.variants.some((variant: any) => variant.quantity > 0);
  }
  return this.availableQuantity > 0;
};

// Instance method to get total stock
productSchema.methods.getTotalStock = function () {
  if (this.variants.length > 0) {
    return this.variants.reduce(
      (total: any, variant: any) => total + variant.quantity,
      0
    );
  }
  return this.availableQuantity;
};

export const ProductModel =
  mongoose.models.Product ||
  mongoose.model<IProduct, IProductModel>("Product", productSchema);
