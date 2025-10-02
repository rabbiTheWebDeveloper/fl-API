import mongoose, { Schema } from "mongoose";
import { ICategory } from "./category.interface";
import slugify from "slugify";
const escapeRegex = (string: string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const categorysSchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    imageFileId: {
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
categorysSchema.index({ shopId: 1, name: 1 }, { unique: true });
categorysSchema.pre("save", async function(next) {
  if (!this.isModified("name")) return next();

  const baseSlug = slugify(this.name, { lower: true, strict: true });
  const escapedSlug = escapeRegex(baseSlug);

  // Find all slugs that start with baseSlug
  const regex = new RegExp(`^${escapedSlug}(-[0-9]+)?$`, "i");

  const existingSlugs = await mongoose.models.Category.find({ slug: regex }).select("slug");

  if (existingSlugs.length === 0) {
    this.slug = baseSlug;
  } else {
    // Find the max number suffix
    const numbers = existingSlugs.map(cat => {
      const match = cat.slug.match(/-(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const maxNumber = Math.max(...numbers);
    this.slug = maxNumber === 0 ? `${baseSlug}-1` : `${baseSlug}-${maxNumber + 1}`;
  }

  next();
});

categorysSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate() as any;
  if (update.name) {
    const baseSlug = slugify(update.name, { lower: true, strict: true });
    const regex = new RegExp(`^${baseSlug}(-[0-9]+)?$`, "i");

    const lastSlug = await mongoose.models.Category.findOne({ slug: regex })
      .sort({ slug: -1 })
      .select("slug");

    if (!lastSlug) {
      update.slug = baseSlug;
    } else {
      const match = lastSlug.slug.match(/-(\d+)$/);
      const lastNumber = match ? parseInt(match[1], 10) : 0;
      update.slug =
        lastNumber === 0 ? `${baseSlug}-1` : `${baseSlug}-${lastNumber + 1}`;
    }

    this.setUpdate(update);
  }
  next();
});

export const Categorys = mongoose.model<ICategory>("Category", categorysSchema);
