 export interface ICategory extends Document {
  name: string;
  shopId: string;
  userId?: string; // optional
  slug: string;
  description?: string; // optional
  image?: string;
  imageFileId ?:string // optional
  status?: "active" | "inactive";
}