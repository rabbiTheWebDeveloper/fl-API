import mongoose, { Schema } from "mongoose";
import { ICategory } from "./category.interface";

const categorysSchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    shopId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Categorys = mongoose.model<ICategory>("Category", categorysSchema);
