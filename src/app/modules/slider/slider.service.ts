import imagekit from "../../utlis/imagekit";
import { ISlider } from "./slider.interface";
import { SliderModel } from "./slider.model";

// Create new banner
export const createBannerFromDB = async (data: any): Promise<ISlider> => {
  await data.save();
  return data;
};

// Find banner by user + shop
export const findBannerByUserAndShop = async (
  userId: string,
  shopId: string
) => {
  return await SliderModel.findOne({ userId, shopId });
};

// Upload image to ImageKit
export const uploadBannerImage = async (file: Express.Multer.File) => {
  const uploadResponse = await imagekit.upload({
    file: file.buffer,
    fileName: `slider-${Date.now()}`,
    folder: "/slider/main",
  });

  return {
    url: uploadResponse.url,
    filename: uploadResponse.fileId,
  };
};

// Delete image from ImageKit
export const deleteBannerImage = async (filename: string) => {
  try {
    await imagekit.deleteFile(filename);
  } catch (err: any) {
    console.log("Image delete failed:", err.message);
  }
};

// Update existing banner (images, url, etc.)
export const updateBannerImages = async (
  banner: any,
  newImage: any,
  url?: string
) => {
  let images = banner.images || [];

  if (newImage) {
    images.push(newImage);
  }

  // keep only latest 3 images
  if (images.length > 3) {
    const removedImages = images.slice(0, images.length - 3);

    // delete old images from ImageKit
    for (const img of removedImages) {
      await deleteBannerImage(img.filename);
    }

    // keep latest 3
    images = images.slice(-3);
  }

  banner.images = images;
  banner.url = url || banner.url;

  await banner.save();
  return banner;
};
