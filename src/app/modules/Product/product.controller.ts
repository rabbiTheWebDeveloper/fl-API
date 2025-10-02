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
        filename: uploadResponse.name,
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
            filename: uploadResponse.name,
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
            image = { url: uploadResponse.url, filename: uploadResponse.name };
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
