import { ICategory } from "./category.interface";
import { Categorys } from "./category.model";
import { DeleteResult } from "mongodb";

export const getCategoryDB = async (): Promise<ICategory[]> => {
  return Categorys.find().sort({ createdAt: -1 });
};
export const getCategoryByIdDB = async (id: any): Promise<ICategory[]> => {
  return Categorys.find({ _id: id });
};

export const createCategoryFromDB = async (data: any): Promise<ICategory> => {
  const user = new Categorys(data);
  await user.save();
  return user;
};

export const updateCategoryFromDB = async (
  id: any,
  data: any
): Promise<any> => {
  let result = await Categorys.updateOne({ _id: id }, data);

  return {
    data : result,
    message : "Category updated successfully"
  };
};

export const categorydeleteService = async (
  id: string
): Promise<DeleteResult> => {
  return Categorys.deleteOne({ _id: id });
};
