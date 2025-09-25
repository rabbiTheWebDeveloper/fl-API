import { Router } from "express";
import { blogDelete, createBlog, filterBlog, getAllBlog, getBlogById, updateBlog } from "./blog.controller";
import imageUpload from "../../middleware/imageUpload";

import { auth } from "../../middleware/AuthVerifyMiddleware";

const router:Router = Router();

router.get("/allBlog",getAllBlog);
router.get("/blogDetails/:id", getBlogById)
router.post("/addBlog",imageUpload.single('image'),auth, createBlog)
router.get("/searchBlog/:search", filterBlog);
router.get("/blog-delete/:id",auth, blogDelete);
router.post("/blog-update/:id", imageUpload.single('image'),auth, updateBlog);

export default router;