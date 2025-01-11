import express from "express";
import { Request, Response } from "express";
import { CloudinaryController } from "../controllers/cloudinary.controller";
import multer from "multer";
import { asyncInterceptor } from "../utils/interceptor";

// Initialize Multer for file uploads
const upload = multer({ dest: "public/uploads/" }); // Temporary storage before uploading to Cloudinary
const router = express.Router();
const cloudinaryController = new CloudinaryController();

router.post(
  "/upload",
  upload.single("file"),
  asyncInterceptor(cloudinaryController.uploadFile)
);
router.post("/delete", asyncInterceptor(cloudinaryController.deleteFile));
router.post("/get-file-url", asyncInterceptor(cloudinaryController.getFileUrl));

export default router;
