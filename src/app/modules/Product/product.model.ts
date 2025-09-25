import mongoose, { Schema } from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new Schema<IProduct>(
  {
    title: { type: String },
    keywords: [{ type: String }],
    description: { type: String },
    longDescription: { type: String },
    image: { type: String },
    youtubeLink : { type: String },
    titleSlug : { type: String }
  },
  {
    timestamps: true,
    versionKey:false
  } 
  
);

export const Product = mongoose.model<IProduct>("products", productSchema);