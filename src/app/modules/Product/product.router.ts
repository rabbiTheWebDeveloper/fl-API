import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "./product.controller";
import imageUpload from "../../middleware/imageUpload";

const router: Router = Router();

// ✅ Create Product
router.post(
  "/create",
  imageUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
    { name: "variantImages", maxCount: 50 },
  ]),
  createProduct
);

// ✅ Update Product
router.post(
  "/update/:productId",
  imageUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
    { name: "variantImages", maxCount: 50 },
  ]),
  updateProduct
);

// ✅ Delete Product
router.delete("/delete/:productId", deleteProduct);

export default router;
