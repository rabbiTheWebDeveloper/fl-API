// middlewares/imageUpload.ts
import multer from "multer";

// Store file in memory (gives access to req.file.buffer)
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
