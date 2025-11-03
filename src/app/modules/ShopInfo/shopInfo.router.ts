import { Router } from "express";
import { updateShopInfoController } from "./shopInfo.controller";
import imageUpload from "../../middleware/imageUpload";

const router: Router = Router();
router.post(
  "/shopinfo-update",
  imageUpload.fields([
    { name: "companyLogo", maxCount: 1 }, // Single company logo
    { name: "favicon", maxCount: 1 }, // Single favicon
  ]),
  updateShopInfoController
);

export default router;
