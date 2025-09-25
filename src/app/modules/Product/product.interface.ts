export interface IProduct extends Document {
  title: string;
  keywords?: string[];
  description?: string;
  longDescription?: string;
  image?: string;
  youtubeLink?: string;
  titleSlug?: string;
  }

  // product.interface.ts

// import { Document } from "mongoose";

// export interface IProduct extends Document {
//   title: string;
//   description?: string;
//   longDescription?: string;
//   image?: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }
