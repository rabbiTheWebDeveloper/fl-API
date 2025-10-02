 import { Document, Types } from "mongoose";
 export interface ICategory extends Document {
  name: string;
  shopId: Types.ObjectId;
  userId?: Types.ObjectId;
  slug: string;
  description?: string; // optional
  image?: string;
  imageFileId ?:string // optional
  status?: "active" | "inactive";
}