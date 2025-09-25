import { NextFunction, Request, Response } from "express";
import {
  createProductFromDB,
  getAllProductsFromDB,
  getFilterProduct,
  getProductByIdFromDB,
  productdelete,
  updateProductFromDB,
} from "./product.service";
import { sendApiResponse } from "../../utlis/responseHandler";
import cloudinary from "../../utlis/cloudinary";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { Types } from "mongoose";
import { validationResult } from "express-validator";
import slugify from "slugify";
import generateArabicSlug from "../../utlis/slugify";
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

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const products = await getAllProductsFromDB();
  sendApiResponse(res, 200, true, products);
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const product = await getProductByIdFromDB(id);
  sendApiResponse(res, 200, true, product);
};
export const getProductByFilter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sortBy } = req.params as { sortBy: string };
  const product = await getFilterProduct(sortBy);
  sendApiResponse(res, 200, true, product);
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title,keywords, description, longDescription, youtubeLink } = req.body;

  try {
    const result = await cloudinary.uploader.upload(
      (req.file as Express.Multer.File).path
    );
    const imageUrl = result.secure_url;
    const titleSlug = await generateArabicSlug(title);

    const newProduct: IProduct = new Product({
      title,
      keywords,
      titleSlug,
      longDescription,
      description,
      youtubeLink,
      image: imageUrl,
    });
    console.log(keywords)
    const product = await createProductFromDB(newProduct);
    sendApiResponse(res, 200, true, product);
  } catch (error) {
    console.error("An error occurred:", error);
    sendApiResponse(res, 500, false, "Internal Server Error");
  }
};

export const productDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const result = await productdelete(id);
  sendApiResponse(res, 200, true, result);
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title,keywords, description, longDescription, youtubeLink } = req.body;
  try {
    const productId = req.params.id;
    const existingProduct: any = await Product.findById(productId);
    if (!existingProduct) {
      return sendApiResponse(res, 404, false, "Product not found");
    }
    let imageUrl: any = existingProduct.image;
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        (req.file as Express.Multer.File).path
      );

      if (existingProduct.image) {
        console.log(existingProduct.image);
        const public_id = existingProduct.image.split("/").pop()?.split(".")[0];
        console.log(public_id);
        await cloudinary.uploader.destroy(public_id);
      }
      imageUrl = result.secure_url;
    }
    let titleSlug = existingProduct.titleSlug;

    // Check if the title has changed and generate a new slug if necessary
    if (title && title !== existingProduct.title) {
      titleSlug = await generateArabicSlug(title);
    }
    const newProduct: IProduct = new Product({
      title,
      keywords,
      titleSlug,
      longDescription,
      description,
      youtubeLink,
      image: imageUrl,
    });
    const updateProduct: any = {
      title: newProduct.title,
      keywords: newProduct.keywords,
      titleSlug: newProduct.titleSlug,
      longDescription: newProduct.longDescription,
      description: newProduct.description,
      youtubeLink: newProduct.youtubeLink,
      image: newProduct.image,
    };
    const product = await updateProductFromDB(productId, updateProduct);
    sendApiResponse(res, 200, true, product);
  } catch (error) {
    console.error("An error occurred:", error);
    sendApiResponse(res, 500, false, "Internal Server Error");
  }
};
