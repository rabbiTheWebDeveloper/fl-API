import { Router } from "express";
import { createProduct, getAllProducts, getProductByFilter, getProductById, productDelete, updateProduct} from "./product.controller";
import imageUpload from "../../middleware/imageUpload";

const router:Router = Router();

router.get("/allProducts",getAllProducts);
router.get("/details/:id", getProductById)
router.get("/product-filter/:sortBy", getProductByFilter)
router.post("/addProducts", imageUpload.single('image'),createProduct)
router.post("/product-update/:id", imageUpload.single('image') , updateProduct)
router.get("/product-delete/:id", productDelete);

export default router;