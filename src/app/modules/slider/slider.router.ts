import { Router } from "express";
import {createBanner} from "./slider.controller";
import imageUpload from "../../middleware/imageUpload";
import { auth } from "../../middleware/AuthVerifyMiddleware";
const router:Router = Router();

router.post("/addSlider",imageUpload.single('image'), createBanner)


export default router;