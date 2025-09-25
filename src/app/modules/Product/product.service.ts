import { ObjectId } from "mongoose";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { DeleteResult } from "mongodb";
import { sortingOptions } from "./product.constant";
import cloudinary from "../../utlis/cloudinary";

export const getAllProductsFromDB = async (): Promise<IProduct[]> => {
  return Product.find().sort({createdAt: -1,});
};

export const getFilterProduct = async (sortBy: string): Promise<IProduct[]> => {
  const sortKey: string = sortingOptions[sortBy] || '_id';
  const products: IProduct[] = await Product.find().sort(sortKey);
  return  products

}

export const getProductByIdFromDB = async (id: string): Promise<IProduct[]> => {
  return Product.find({ _id: id });
};



export const createProductFromDB = async ( data:any): Promise<IProduct> => {

    // const user = new Product(data); //User -> class  user -> instance
    await data.save();
    return data;
  };


  export const updateProductFromDB = async (id: any, data: any): Promise<any> => {
    try {
      const result = await Product.updateOne({ _id: id }, { $set: data }, { new: true });
      if (result.modifiedCount === 0) {
        throw new Error("Product not found or not modified");
      }
      const updatedDocument = await Product.findById(id);
      if (!updatedDocument) {
        throw new Error("Product not found");
      }
      return updatedDocument;
    } catch (error) {
      console.error("Error updating Product:", error);
      throw error;
    }
  };
  

  export const productdelete = async (id: string): Promise<DeleteResult> => {
    try {
      const productToDelete = await Product.findById(id);
      if (!productToDelete) {
        throw new Error(`Product with id ${id} not found.`);
      }
      if (productToDelete.image) {
        const public_id:any= productToDelete.image.split('/').pop()?.split('.')[0]; // Extract public_id from image URL
        await cloudinary.uploader.destroy(public_id); 
      }
      const deleteResult = await Product.deleteOne({ _id: id });
      return deleteResult;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error; 
    }
  };