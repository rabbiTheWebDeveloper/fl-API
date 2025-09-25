import { IBlog } from "./blog.interface";
import { Blogs } from "./blog.model";
import { DeleteResult } from "mongodb";
export const getAllBlogFromDB = async (): Promise<IBlog[]> => {
  return Blogs.find().sort({createdAt: -1, });
};

export const getBlogByIdFromDB = async (id: string): Promise<IBlog[]> => {
  return Blogs.find({ _id: id });
};

export const getBlogByFilter = async (data: string): Promise<IBlog[]> => {
  return Blogs.find({ blog_category: data});
};

export const createBlogFromDB = async ( data:any): Promise<IBlog> => {
    // const user = new Product(data); //User -> class  user -> instance
    await data.save();
    return data;
  };

  export const blogdelete = async ( id: string): Promise<DeleteResult> => {
    // const user = new Product(data); //User -> class  user -> instance
    return Blogs.deleteOne({ _id: id });
  };

  export const updateBlogFromDB = async (id: any, data: any): Promise<any> => {
    try {
      const result = await Blogs.updateOne({ _id: id }, { $set: data }, { new: true });
      if (result.modifiedCount === 0) {
        throw new Error("Blogs not found or not modified");
      }
      const updatedDocument = await Blogs.findById(id);
      if (!updatedDocument) {
        throw new Error("Blogs not found");
      }
      return updatedDocument;
    } catch (error) {
      console.error("Error updating Blogs:", error);
      throw error;
    }
  };