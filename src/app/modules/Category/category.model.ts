import mongoose, { Schema } from "mongoose";
import { ICategory } from "./category.interface";
import slugify from "slugify";

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

categorysSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });

    // Find the slug with the highest number for this baseSlug
    const regex = new RegExp(`^${baseSlug}(-[0-9]+)?$`, "i");

    const lastSlug = await mongoose.models.Categorys.findOne({ slug: regex })
      .sort({ slug: -1 }) // get the "last" one
      .select("slug");

    if (!lastSlug) {
      this.slug = baseSlug;
    } else {
      const match = lastSlug.slug.match(/-(\d+)$/);
      const lastNumber = match ? parseInt(match[1], 10) : 0;
      this.slug =
        lastNumber === 0 ? `${baseSlug}-1` : `${baseSlug}-${lastNumber + 1}`;
    }
  }
  next();
});

export const Categorys = mongoose.model<ICategory>("Category", categorysSchema);
