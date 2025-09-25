import mongoose, { Schema } from "mongoose";
import { IBanner} from "./banner.interface";

const bannerSchema = new Schema<IBanner>(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
  
  },
  {
    timestamps: true,
    versionKey:false
  } 
  
);

export const Banner = mongoose.model<IBanner>("Banner", bannerSchema);