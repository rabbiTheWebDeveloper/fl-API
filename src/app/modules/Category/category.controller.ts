import { NextFunction, Request, Response } from "express";
import { sendApiResponse } from "../../utlis/responseHandler";
import {categorydeleteService, createCategoryFromDB, getCategoryByIdDB, getCategoryDB, updateCategoryFromDB } from "./category.service";
import mongoose from "mongoose";
import { validationResult } from "express-validator";


export const getCategorys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const products = await getCategoryDB();
  sendApiResponse(res, 200, true, products);
};

export const getCategorysByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { id } = req.params;
  const products = await getCategoryByIdDB(id);
  sendApiResponse(res, 200, true, products);
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate the 'id' parameter (you can use mongoose.Types.ObjectId.isValid())
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    // Delete the category using categorydeleteService
    const products = await categorydeleteService(id);

    // Send a success response with 204 No Content status
    res.status(204).send();
  } catch (error) {
    // Handle errors gracefully
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const addCategory = async (req: Request,res: Response,next: NextFunction
  ) => {
    const payload = req.body;
    const product = await createCategoryFromDB( payload);
    sendApiResponse(res, 200, true, product);
  };

  export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const payload = req.body;
  
      // Validate the request payload
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // Update the category using categoryService
      const updatedCategory = await updateCategoryFromDB(id, payload);
  
      if (!updatedCategory) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      // Send a success response with the updated category
      res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
      // Handle errors gracefully
      console.error('Error updating category:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };