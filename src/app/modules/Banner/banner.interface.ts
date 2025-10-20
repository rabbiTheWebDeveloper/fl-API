import { Types } from "mongoose";

export interface IBanner extends Document {
  url?: string;
  shopId: Types.ObjectId;
  userId: Types.ObjectId;
  image: string;
}
