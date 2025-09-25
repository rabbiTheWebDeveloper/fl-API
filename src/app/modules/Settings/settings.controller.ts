import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendApiResponse } from "../../utlis/responseHandler";
import cloudinary from "../../utlis/cloudinary";
import { ISettings } from "./settings.interface";
import { Setting } from "./settings.model";
import { createSettingFromDB, getSettingDB, updateSettingFromDB } from "./settings.service";
import catchAsync from "../../shared/catchAsync";

export const getSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const products = await getSettingDB();
  sendApiResponse(res, 200, true, products);
};

export const updateSettings: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user,websiteName, metaLink,phoneNumber,whatsappNumber,facebookLink,instagramLink,youtubeLink,twitterLink,sectionName, sectionDes } = req.body;
    let logoUrl = req.body.logo;
    let favIconUrl = req.body.favIcon;

    
      const existingSetting: ISettings | null = await Setting.findById("666ebddff209767f563e46a6").maxTimeMS(20000);

      if (!existingSetting) {
        return sendApiResponse(res, 404, false, "Settings not found");
      }

      if (req.files && Array.isArray(req.files)) {
        const files = req.files as Express.Multer.File[];
        for (const file of files) {
          const result = await cloudinary.uploader.upload(file.path);
          if (file.fieldname === 'logo') {
            if (existingSetting.logo) {
              // Destroy existing logo
              const publicId = getPublicIdFromUrl(existingSetting.logo);
              await cloudinary.uploader.destroy(publicId);
            }
            logoUrl = result.secure_url;
          } else if (file.fieldname === 'favIcon') {
            if (existingSetting.favIcon) {
              // Destroy existing favIcon
              const publicId = getPublicIdFromUrl(existingSetting.favIcon);
              await cloudinary.uploader.destroy(publicId);
            }
            favIconUrl = result.secure_url;
          }
        }
      }
    const newSettings: Partial<ISettings> = {
      websiteName,
      metaLink,
      logo: logoUrl,
      favIcon: favIconUrl,
      phoneNumber,
      whatsappNumber,
      facebookLink,
      instagramLink,
      youtubeLink,
      twitterLink,
      sectionName,
      sectionDes
    }
    const product = await updateSettingFromDB("666ebddff209767f563e46a6" ,newSettings);
    sendApiResponse(res, 200, true, product);
  }
);

function getPublicIdFromUrl(url: string): string {
  const parts = url.split('/');
  const publicIdWithExtension = parts[parts.length - 1];
  const publicId = publicIdWithExtension.split('.')[0];
  return publicId;
}
