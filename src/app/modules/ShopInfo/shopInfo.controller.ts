import { NextFunction, Request, Response } from "express";
import { updateShopInfoFromDB } from "./shopInfo.service";
import { sendApiResponse } from "../../utlis/responseHandler";
import slugify from "slugify";
import imagekit from "../../utlis/imagekit";
import { ShopInfoModel } from "./shopInfo.model";

export const updateShopInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shopId, userId } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!shopId || !userId) {
      return sendApiResponse(
        res,
        400,
        false,
        "Shop ID and User ID are required"
      );
    }

    // --- Get existing shop info ---
    const existingShopInfo = await ShopInfoModel.findOne({ shopId, userId });

    // --- Handle company logo upload ---
    let companyLogo = existingShopInfo?.companyLogo || null;
    if (files?.companyLogo?.[0]) {
      // 🧹 Delete old company logo if exists
      if (existingShopInfo?.companyLogo?.publicId) {
        try {
          await imagekit.deleteFile(existingShopInfo.companyLogo.publicId);
        } catch (err: any) {
          console.warn("⚠️ Error deleting old logo:", err.message);
        }
      }

      // 📤 Upload new logo
      const file = files.companyLogo[0];
      const uploadResponse = await imagekit.upload({
        file: file.buffer,
        fileName: `${slugify("company-logo", { lower: true })}-${Date.now()}`,
        folder: "/mersent/main",
      });

      companyLogo = {
        url: uploadResponse.url,
        publicId: uploadResponse.fileId, // use `fileId` (ImageKit’s unique ID)
      };
    }

    // --- Handle favicon upload ---
    let favicon = existingShopInfo?.favicon || null;
    if (files?.favicon?.[0]) {
      // 🧹 Delete old favicon if exists
      if (existingShopInfo?.favicon?.publicId) {
        try {
          await imagekit.deleteFile(existingShopInfo.favicon.publicId);
        } catch (err: any) {
          console.warn("⚠️ Error deleting old favicon:", err.message);
        }
      }

      // 📤 Upload new favicon
      const file = files.favicon[0];
      const uploadResponse = await imagekit.upload({
        file: file.buffer,
        fileName: `${slugify("favicon", { lower: true })}-${Date.now()}`,
        folder: "/mersent/main",
      });

      favicon = {
        url: uploadResponse.url,
        publicId: uploadResponse.fileId,
      };
    }

    // --- Prepare payload for DB update ---
    const payload = {
      ...req.body,
      companyLogo,
      favicon,
    };

    // --- Update database ---
    const updatedInfo = await updateShopInfoFromDB(payload);

    sendApiResponse(res, 200, true, updatedInfo);
  } catch (error: any) {
    console.error("❌ Error in updateShopInfoController:", error);
    sendApiResponse(res, 500, false, error.message || "Internal Server Error");
  }
};
