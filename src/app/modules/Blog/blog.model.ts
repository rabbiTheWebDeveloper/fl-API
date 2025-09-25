import mongoose, { Schema } from "mongoose";
import { IBlog } from "./blog.interface";

const blogSchema = new Schema<IBlog>(
  {
    blog_title : {
      type: String,
      required: true,
    },
    blog_name: {
      type: String,
      required: true,
    },
    blog_category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    image: String,
    // sku: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
  },
  {
    timestamps: true,
    versionKey:false
  } 
  
);

export const Blogs = mongoose.model<IBlog>("blogs", blogSchema);