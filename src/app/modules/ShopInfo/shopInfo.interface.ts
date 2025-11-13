import mongoose, { Document, Model, Types } from "mongoose";

export interface IShopInfo extends Document {
  shopId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  shopAddress: string;
  domain_verify?: string;
  phone: string;
  defaultDeliveryLocation?: string;
  companyLogo?: {
    url?: string;
    publicId?: string;
  };
  favicon?: {
    url?: string;
    publicId?: string;
  };
  shopInfo?: string;
  metaDescription?: string;
  websiteTitle?: string;
  description?: string;
  lastUpdatedBy?: mongoose.Types.ObjectId;
}
