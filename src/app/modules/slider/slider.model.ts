import mongoose, { Schema } from "mongoose";
import { ISlider } from "./slider.interface";

const bannerSchema = new Schema<ISlider>(
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

export const SliderModel = mongoose.model<ISlider>("Slider", bannerSchema);
