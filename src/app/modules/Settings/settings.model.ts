import mongoose, { Schema } from "mongoose";
import { ISettings } from "./settings.interface";


const settingsSchema = new Schema<ISettings>(
  {
    user: { type: String },
    websiteName: { type: String },
    metaLink: { type: String },
    logo: { type: String },
    favIcon: { type: String },
    phoneNumber: { type: String },
    whatsappNumber: { type: String },
    facebookLink: { type: String },
    instagramLink: { type: String },
    youtubeLink: { type: String },
    twitterLink: { type: String },
    sectionName: { type: String },
    sectionDes: { type: String },
  },
  {
    timestamps: true,
    versionKey:false
  } 
  
);

export const Setting = mongoose.model<ISettings>("settings", settingsSchema);