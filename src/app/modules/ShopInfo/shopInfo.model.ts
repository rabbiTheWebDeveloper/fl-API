import mongoose, { Schema, Model } from "mongoose";
import { IShopInfo } from "./shopInfo.interface";
export interface IShopInfoModel extends Model<IShopInfo> {}
const shopInfoSchema = new Schema<IShopInfo>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopAddress: {
      type: String,
      required: true,
      trim: true,
    },
    domain_verify: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{6,15}$/, "Invalid phone number"],
    },
    defaultDeliveryLocation: {
      type: String,
      default: "",
      trim: true,
    },
    companyLogo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    favicon: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    shopInfo: {
      type: String,
      default: "",
      trim: true,
    },
    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },
    websiteTitle: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },

    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

export const ShopInfoModel =
  mongoose.models.ShopInfo ||
  mongoose.model<IShopInfo, IShopInfoModel>("ShopInfo", shopInfoSchema);
