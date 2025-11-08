import { NextFunction, Request, Response } from "express";
import {
  createProductFromDB,
  productdelete,
  updateProductFromDB,
} from "./product.service";
import { sendApiResponse } from "../../utlis/responseHandler";
import cloudinary from "../../utlis/cloudinary";
import { IProduct } from "./product.interface";

import slugify from "slugify";
import generateArabicSlug from "../../utlis/slugify";
import { ProductModel } from "./product.model";
import imagekit from "../../utlis/imagekit";
slugify.extend({
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
});

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { productName } = req.body;

    let deliveryCharges = undefined;
    if (req.body.deliveryCharges) {
      try {
        deliveryCharges = JSON.parse(req.body.deliveryCharges);
      } catch (err) {
        console.error("Invalid deliveryCharges JSON:", err);
        return sendApiResponse(
          res,
          400,
          false,
          "Invalid deliveryCharges format"
        );
      }
    }

    // --- Upload mainImage ---
    let mainImage = null;
    if (files?.mainImage?.[0]) {
      const file = files.mainImage[0];
      const uploadResponse = await imagekit.upload({
        file: file.buffer,
        fileName: `${slugify(productName || "product", {
          lower: true,
        })}-${Date.now()}`,
        folder: "/products/main",
      });
      mainImage = {
        url: uploadResponse.url,
        filename: uploadResponse.fileId,
      };
    }

    // --- Upload galleryImages ---
    let galleryImages: { url: string; filename: string }[] = [];
    if (files?.galleryImages?.length) {
      galleryImages = await Promise.all(
        files.galleryImages.map(async (file) => {
          const uploadResponse = await imagekit.upload({
            file: file.buffer,
            fileName: `${slugify(productName || "gallery", {
              lower: true,
            })}-${Date.now()}`,
            folder: "/products/gallery",
          });
          return {
            url: uploadResponse.url,
            filename: uploadResponse.fileId,
          };
        })
      );
    }

    // --- Upload variantImages ---
    let variants: any[] = [];
    if (req.body.variants) {
      const variantData = JSON.parse(req.body.variants); // expects JSON string from frontend
      const variantFiles = files?.variantImages || [];

      variants = await Promise.all(
        variantData.map(async (v: any, index: number) => {
          let image = null;
          if (variantFiles[index]) {
            const uploadResponse = await imagekit.upload({
              file: variantFiles[index].buffer,
              fileName: `${slugify(v.productCode || "variant", {
                lower: true,
              })}-${Date.now()}`,
              folder: "/products/variants",
            });
            image = {
              url: uploadResponse.url,
              filename: uploadResponse.fileId,
            };
          }
          return { ...v, image };
        })
      );
    }

    // --- Create product in DB ---
    const product = await createProductFromDB({
      ...req.body,
      mainImage,
      deliveryCharges,
      galleryImages,
      variants,
    });

    sendApiResponse(res, 200, true, product);
  } catch (error: any) {
    console.error("An error occurred:", error);
    sendApiResponse(res, 500, false, error.message || "Internal Server Error");
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { productName } = req.body;

    // --- Parse deliveryCharges ---
    let deliveryCharges = undefined;
    if (req.body.deliveryCharges) {
      try {
        deliveryCharges = JSON.parse(req.body.deliveryCharges);
      } catch (err) {
        console.error("Invalid deliveryCharges JSON:", err);
        return sendApiResponse(
          res,
          400,
          false,
          "Invalid deliveryCharges format"
        );
      }
    }

    // --- Find existing product ---
    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return sendApiResponse(res, 404, false, "Product not found");
    }

    // --- Upload new main image if provided ---
    let mainImage = existingProduct.mainImage;
    if (files?.mainImage?.[0]) {
      const file = files.mainImage[0];

      // 🧹 Delete old image from ImageKit (if exists)
      if (mainImage?.filename) {
        try {
          await imagekit.deleteFile(mainImage.filename);
        } catch (err: any) {
          console.warn("ImageKit main image delete failed:", err.message);
        }
      }

      const uploadResponse = await imagekit.upload({
        file: file.buffer,
        fileName: `${slugify(productName || "product", {
          lower: true,
        })}-${Date.now()}`,
        folder: "/products/main",
      });

      mainImage = {
        url: uploadResponse.url,
        filename: uploadResponse.fileId,
      };
    }

    // --- Upload new gallery images if provided ---
    let galleryImages = existingProduct.galleryImages || [];
    if (files?.galleryImages?.length) {
      // 🧹 Delete old gallery images
      if (galleryImages.length) {
        for (const img of galleryImages) {
          if (img.filename) {
            try {
              await imagekit.deleteFile(img.filename);
            } catch (err: any) {
              console.warn("ImageKit gallery delete failed:", err.message);
            }
          }
        }
      }

      // ✅ Upload new ones
      galleryImages = await Promise.all(
        files.galleryImages.map(async (file) => {
          const uploadResponse = await imagekit.upload({
            file: file.buffer,
            fileName: `${slugify(productName || "gallery", {
              lower: true,
            })}-${Date.now()}`,
            folder: "/products/gallery",
          });
          return {
            url: uploadResponse.url,
            filename: uploadResponse.fileId,
          };
        })
      );
    }

    // --- Update variant images ---
    let variants = existingProduct.variants || [];
    if (req.body.variants) {
      const variantData = JSON.parse(req.body.variants);
      const variantFiles = files?.variantImages || [];

      variants = await Promise.all(
        variantData.map(async (v: any, index: number) => {
          let image = v.image || null;

          // ✅ if a new image is uploaded for this variant
          if (variantFiles[index]) {
            // 🧹 delete old variant image
            if (v.image?.filename) {
              try {
                await imagekit.deleteFile(v.image.filename);
              } catch (err: any) {
                console.warn("ImageKit variant delete failed:", err.message);
              }
            }

            const uploadResponse = await imagekit.upload({
              file: variantFiles[index].buffer,
              fileName: `${slugify(v.productCode || "variant", {
                lower: true,
              })}-${Date.now()}`,
              folder: "/products/variants",
            });

            image = {
              url: uploadResponse.url,
              filename: uploadResponse.fileId,
            };
          }

          return { ...v, image };
        })
      );
    }

    // --- Update product ---
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        ...req.body,
        mainImage,
        deliveryCharges,
        galleryImages,
        variants,
      },
      { new: true }
    );

    sendApiResponse(res, 200, true, updatedProduct);
  } catch (error: any) {
    console.error("Error updating product:", error);
    sendApiResponse(res, 500, false, error.message || "Internal Server Error");
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    // --- Find product ---
    const product = await ProductModel.findById(productId);
    if (!product) {
      return sendApiResponse(res, 404, false, "Product not found");
    }

    // --- Delete main image if exists ---
    if (product.mainImage?.filename) {
      try {
        await imagekit.deleteFile(product.mainImage.filename);
      } catch (err: any) {
        console.warn("Main image not found in ImageKit:", err.message);
      }
    }

    // --- Delete gallery images ---
    if (product.galleryImages?.length) {
      await Promise.all(
        product.galleryImages.map(async (img: any) => {
          try {
            await imagekit.deleteFile(img.filename);
          } catch (err) {
            console.warn("Gallery image delete failed:", img.filename);
          }
        })
      );
    }

    // --- Delete variant images ---
    if (product.variants?.length) {
      await Promise.all(
        product.variants.map(async (variant: any) => {
          if (variant.image?.filename) {
            try {
              await imagekit.deleteFile(variant.image.filename);
            } catch (err) {
              console.warn(
                "Variant image delete failed:",
                variant.image.filename
              );
            }
          }
        })
      );
    }

    // --- Delete product from DB ---
    await ProductModel.findByIdAndDelete(productId);

    sendApiResponse(res, 200, true, "Product deleted successfully ✅");
  } catch (error: any) {
    console.error("Error deleting product:", error);
    sendApiResponse(res, 500, false, error.message || "Internal Server Error");
  }
};
