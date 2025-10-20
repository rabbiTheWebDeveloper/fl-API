import { NextFunction, Request, Response } from "express";
import {
  createBannerFromDB,
  findBannerByUserAndShop,
  updateBannerImages,
  uploadBannerImage,
} from "./banner.service";
import { sendApiResponse } from "../../utlis/responseHandler";
import { Banner } from "./banner.model";

export const createBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { url, userId, shopId } = req.body;
    let uploadedImage = null;

    // upload image if provided
    if (req.file) {
      uploadedImage = await uploadBannerImage(req.file);
    }

    // check if banner exists
    let existingBanner = await findBannerByUserAndShop(userId, shopId);

    if (existingBanner) {
      // update banner
      const updatedBanner = await updateBannerImages(
        existingBanner,
        uploadedImage,
        url
      );
      return sendApiResponse(res, 200, true, updatedBanner);
    } else {
      // create new banner
      const newBanner = new Banner({
        url,
        userId,
        shopId,
        images: uploadedImage ? [uploadedImage] : [],
      });

      const banner = await createBannerFromDB(newBanner);
      return sendApiResponse(res, 200, true, banner);
    }
  } catch (error) {
    console.error("Banner create error:", error);
    next(error);
  }
};
