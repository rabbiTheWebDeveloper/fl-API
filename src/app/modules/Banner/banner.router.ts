import { Router } from "express";
import { bannerDelete, createBanner, getAllBanner,} from "./banner.controller";
import imageUpload from "../../middleware/imageUpload";
import { auth } from "../../middleware/AuthVerifyMiddleware";
const router:Router = Router();
router.get("/allBanner", getAllBanner);
router.get("/banner-delete/:id", bannerDelete)
router.post("/addBanner",imageUpload.single('image'), createBanner)


export default router;