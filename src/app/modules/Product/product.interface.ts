import mongoose, { Document, Model, Types } from "mongoose";

// Variant Schema Interface
interface IVariant {
  _id?: mongoose.Types.ObjectId;
  combination: string;
  values: Map<string, string>;
  image?: {
    url?: string;
    filename?: string;
  };
  price: number;
  productCode: string;
  quantity: number;
  description?: string;
}

// Delivery Charges Interface
interface IDeliveryCharges {
  dhaka: number;
  outsideDhaka: number;
  subarea: number;
}

// Variant Config Interface
interface IVariantConfig {
  variantType1: "size" | "color" | "material" | "";
  variantType2: "size" | "color" | "material" | "none" | "";
  selectedOptions1: string[];
  selectedOptions2: string[];
}

// Main Product Interface
export interface IProduct extends Document {
  productName: string;
  productCode: string;
  categoryId:Types.ObjectId;
  shopId: Types.ObjectId;
  userId?: Types.ObjectId;
  availableQuantity: number;
  shortDescription?: string;
  longDescription?: string;

  regularPrice: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountedPrice?: number;

  deliveryCharge: "free" | "paid";
  deliveryCharges: IDeliveryCharges;

  mainImage?: {
    url?: string;
    filename?: string;
  };
  galleryImages: {
    url?: string;
    filename?: string;
    position?: number;
  }[];

  variants: IVariant[];
  variantConfig: IVariantConfig;

  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  isFeatured: boolean;

  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;

  // Virtuals
  calculatedDiscountPrice: number;

  // Methods
  isInStock(): boolean;
  getTotalStock(): number;
}

// Model Type (with statics)
export interface IProductModel extends Model<IProduct> {
  findActive(): Promise<IProduct[]>;
}
