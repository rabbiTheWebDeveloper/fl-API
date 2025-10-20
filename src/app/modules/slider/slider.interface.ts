import { Types } from "mongoose";

export interface ISlider extends Document {
  url?: string;
  shopId: Types.ObjectId;
  userId: Types.ObjectId;
  image: string;
}
