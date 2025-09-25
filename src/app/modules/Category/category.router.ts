import { Router } from "express";
import { addCategory, deleteCategory, getCategorys, getCategorysByID, updateCategory,  } from "./category.controller";
import { auth } from "../../middleware/AuthVerifyMiddleware";
const router:Router = Router();

router.get("/",getCategorys);
router.get("/:id",getCategorysByID);
router.post("/create",auth, addCategory)
router.post("/update/:id",auth, updateCategory)
router.get("/create-delete/:id", auth,deleteCategory)

export default router;