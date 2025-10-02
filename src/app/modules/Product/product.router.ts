import { Router } from "express";
import { createProduct } from "./product.controller";
import imageUpload from "../../middleware/imageUpload";

const router: Router = Router();
router.post(
  "/create",
  imageUpload.fields([
    { name: "mainImage", maxCount: 1 }, // Single main image
    { name: "galleryImages", maxCount: 10 }, // Multiple gallery images
    { name: "variantImages", maxCount: 50 }, // Variant images (handle mapping manually)
  ]),
  createProduct
);

export default router;
