import mongoose, { Schema } from "mongoose";
import { IBanner } from "./banner.interface";

const bannerSchema = new Schema<IBanner>(
  {
    url: {
      type: String,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    images: [
      {
        url: String,
        filename: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Banner = mongoose.model<IBanner>("Banner", bannerSchema);
