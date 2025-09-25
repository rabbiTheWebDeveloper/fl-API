import { NextFunction, Request, Response } from "express";
import {
  blogdelete,
  createBlogFromDB,
  getAllBlogFromDB,
  getBlogByFilter,
  getBlogByIdFromDB,
  updateBlogFromDB,
} from "./blog.service";
import { IBlog } from "./blog.interface";
import { sendApiResponse } from "../../utlis/responseHandler";
import cloudinary from "../../utlis/cloudinary";
import { Blogs } from "./blog.model";

export const getAllBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const products = await getAllBlogFromDB();
  sendApiResponse(res, 200, true, products);
};

export const getBlogById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const product = await getBlogByIdFromDB(id);
  sendApiResponse(res, 200, true, product);
};

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { blog_title, blog_name, blog_category, description } = req.body;

  // Upload image to Cloudinary
  const result = await cloudinary.uploader.upload(
    (req.file as Express.Multer.File).path
  );

  // Get the image URL from the Cloudinary response
  const imageUrl = result.secure_url;
  const newBlog: IBlog = new Blogs({
    blog_title,
    blog_name,
    blog_category,
    description,
    image: imageUrl,
  });

  const product = await createBlogFromDB(newBlog);
  sendApiResponse(res, 200, true, product);
};

export const filterBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const search = req.params.search as string;
  const result = await getBlogByFilter(search);
  sendApiResponse(res, 200, true, result);
};

export const blogDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id as string;

  const result = await blogdelete(id);
  sendApiResponse(res, 200, true, result);
};

export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { blog_title, blog_name, blog_category, description } = req.body;
  const blogId = req.params.id;
  const existingProduct: any = await Blogs.findById(blogId);

  let imageUrl: any = existingProduct.image;
  if (req.file) {
    const result = await cloudinary.uploader.upload(
      (req.file as Express.Multer.File).path
    );
    imageUrl = result.secure_url;
  }

  const newBlog: IBlog = new Blogs({
    blog_title,
    blog_name,
    blog_category,
    description,
    image: imageUrl,
  });

  const updatePayload: any = {
    blog_title: newBlog.blog_title,
    blog_name: newBlog.blog_name,
    blog_category: newBlog.blog_category,
    description: newBlog.description,
    image: newBlog.image,
  };

  const product = await updateBlogFromDB(blogId, updatePayload);
  sendApiResponse(res, 200, true, product);
};
