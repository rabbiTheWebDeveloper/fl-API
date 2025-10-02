import { NextFunction, Request, Response } from "express";
import { sendApiResponse } from "../../utlis/responseHandler";
import {
  categorydeleteService,
  createCategoryFromDB,
  updateCategoryFromDB,
} from "./category.service";
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
    let imageFileId = "";

    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer.toString("base64"),
        fileName: `${slugify(name || "category", {
          lower: true,
        })}-${Date.now()}.jpg`,
        folder: "/categories",
      });

      imageUrl = uploadResponse.url;
      imageFileId = uploadResponse.fileId; // ✅ save fileId for delete later
    }

    const payload = {
      ...req.body,
      image: imageUrl,
      imageFileId: imageFileId, // ✅ save in DB
    };

    const category = await createCategoryFromDB(payload);
    sendApiResponse(res, 200, true, category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Delete category called", req.params.id);
    const category = await Categorys.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // delete image if exists
    if (category.imageFileId) {
      const imageFileId = category.imageFileId;
      await imagekit.deleteFile(imageFileId);
    }
    console.log("Category found: ", category);
    await categorydeleteService(req.params.id);

    sendApiResponse(res, 200, true, {
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Categorys.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    let imageUrl = category.image; // keep old image by default
    let imageFileId = category.imageFileId; // keep old fileId by default

    // If new image uploaded
    if (req.file) {
      // delete old image if exists
      if (category.imageFileId) {
        await imagekit.deleteFile(category.imageFileId);
      }

      // upload new image
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer.toString("base64"),
        fileName: `${slugify(req.body.name || category.name || "category", {
          lower: true,
        })}-${Date.now()}.jpg`,
        folder: "/categories",
      });

      imageUrl = uploadResponse.url;
      imageFileId = uploadResponse.fileId;
    }
    const updatedCategory = await updateCategoryFromDB(req.params.id, {
      ...req.body,
      image: imageUrl,
      imageFileId: imageFileId,
    });

    sendApiResponse(res, 200, true, updatedCategory);
  } catch (error) {
    next(error);
  }
};
