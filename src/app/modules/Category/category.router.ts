import { Router } from "express";
import { addCategory, deleteCategory, updateCategory } from "./category.controller";
import { auth } from "../../middleware/AuthVerifyMiddleware";
import imageUpload from "../../middleware/imageUpload";
const router: Router = Router();
router.post("/create", imageUpload.single("image"), addCategory);
router.delete("/create-delete/:id", deleteCategory);
router.patch("/update/:id",imageUpload.single("image"), updateCategory);

export default router;
