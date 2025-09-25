import { NextFunction, Request, Response } from "express";
import {
  bannerdelete,
  createBannerFromDB,
  getAllBannerFromDB,

} from "./banner.service";
import { sendApiResponse } from "../../utlis/responseHandler";
import { IBanner } from "./banner.interface";
import { Banner } from "./banner.model";
import cloudinary from "../../utlis/cloudinary";

export const getAllBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const products = await getAllBannerFromDB();
  sendApiResponse(res, 200, true, products);
};

export const createBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const result = await cloudinary.uploader.upload(
    (req.file as Express.Multer.File).path
  );
  const imageUrl = result.secure_url;
  const newProduct: IBanner = new Banner({
    name,
    image: imageUrl,
  });
  const product = await createBannerFromDB(newProduct);
  sendApiResponse(res, 200, true, product);
};

export const bannerDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const productId = req.params.id;
 
  const result = await bannerdelete(id);
  sendApiResponse(res, 200, true, result);
};


