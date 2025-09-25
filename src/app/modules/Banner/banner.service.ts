import cloudinary from "../../utlis/cloudinary";
import { IBanner } from "./banner.interface";
import { Banner } from "./banner.model";
import { DeleteResult } from "mongodb";

export const getAllBannerFromDB = async (): Promise<IBanner[]> => {
  return Banner.find().sort({createdAt: -1,});
};


export const createBannerFromDB = async ( data:any): Promise<IBanner> => {
    await data.save();
    return data;
  };

  export const bannerdelete = async (id: string): Promise<DeleteResult> => {
    try {
      const existingBanner: any = await Banner.findById(id);
  
      if (!existingBanner) {
        throw new Error(`Banner with id ${id} not found`);
      }
  
      if (existingBanner.image) {
        const publicId = existingBanner.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        } else {
          console.warn(`Failed to extract publicId from image URL: ${existingBanner.image}`);
        }
      }
  
      return await Banner.deleteOne({ _id: id });
    } catch (error) {
      console.error(`Failed to delete banner with id ${id}:`, error);
      throw error;
    }
  };


