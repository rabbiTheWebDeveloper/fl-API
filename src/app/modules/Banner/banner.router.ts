import { Router } from "express";
import {createBanner} from "./banner.controller";
import imageUpload from "../../middleware/imageUpload";
import { auth } from "../../middleware/AuthVerifyMiddleware";
const router:Router = Router();

router.post("/addBanner",imageUpload.single('image'), createBanner)


export default router;