import { Router } from "express";
import {
  addCategory,
} from "./category.controller";
import { auth } from "../../middleware/AuthVerifyMiddleware";
import imageUpload from "../../middleware/imageUpload";
const router: Router = Router();
router.post("/create", imageUpload.single("image"), addCategory);


export default router;
