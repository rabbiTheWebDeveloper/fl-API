import { NextFunction, Request, Response } from "express";
import { sendApiResponse } from "../../utlis/responseHandler";
import { createCategoryFromDB } from "./category.service";
import slugify from "slugify";
import ImageKit from "imagekit";
import { Categorys } from "./category.model";
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});


export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }
    let imageUrl = "";
   
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer.toString("base64"),
        fileName: `${slugify(name || "category", {
          lower: true,
        })}-${Date.now()}.jpg`,
        folder: "/categories",
      });

      imageUrl = uploadResponse.url;
    }

    const payload = {
      ...req.body,
      image: imageUrl,
    };

    const category = await createCategoryFromDB(payload);
    sendApiResponse(res, 200, true, category);
  } catch (error) {
    next(error);
  }
};
