import { ObjectId } from "mongoose";
import { IProduct } from "./product.interface";

import { DeleteResult } from "mongodb";
import { sortingOptions } from "./product.constant";
import cloudinary from "../../utlis/cloudinary";
import { ProductModel } from "./product.model";

export const getAllProductsFromDB = async (): Promise<IProduct[]> => {
  return ProductModel.find().sort({ createdAt: -1 });
};

export const getFilterProduct = async (sortBy: string): Promise<IProduct[]> => {
  const sortKey: string = sortingOptions[sortBy] || "_id";
  const products: IProduct[] = await ProductModel.find().sort(sortKey);
  return products;
};

export const getProductByIdFromDB = async (id: string): Promise<IProduct[]> => {
  return ProductModel.find({ _id: id });
};

export const createProductFromDB = async (data: any): Promise<IProduct> => {
  const product = new ProductModel(data); //User -> class  user -> instance
  await product.save();
  return product;
};

export const updateProductFromDB = async (id: any, data: any): Promise<any> => {
  try {
    const result = await ProductModel.updateOne(
      { _id: id },
      { $set: data },
   
    );
    if (result.modifiedCount === 0) {
      throw new Error("Product not found or not modified");
    }
    const updatedDocument = await ProductModel.findById(id);
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
    const productToDelete = await ProductModel.findById(id);
    if (!productToDelete) {
      throw new Error(`Product with id ${id} not found.`);
    }
    if (productToDelete.image) {
      const public_id: any = productToDelete.image
        .split("/")
        .pop()
        ?.split(".")[0]; // Extract public_id from image URL
      await cloudinary.uploader.destroy(public_id);
    }
    const deleteResult = await ProductModel.deleteOne({ _id: id });
    return deleteResult;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
