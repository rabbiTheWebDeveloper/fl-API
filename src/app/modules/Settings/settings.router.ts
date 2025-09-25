import { Router } from "express";
import { getSettings, updateSettings } from "./settings.controller";
import imageUpload from "../../middleware/imageUpload";


const router:Router = Router();

router.get("/settings",getSettings);
router.post('/setting-update', imageUpload.any(), updateSettings);

export default router;