import express from "express";
import { Request, Response } from "express";
import { CloudinaryController } from "../controllers/cloudinary.controller";
import multer from "multer";

// Initialize Multer for file uploads
const upload = multer({ dest: "public/uploads/" }); // Temporary storage before uploading to Cloudinary
const router = express.Router();
const cloudinaryController = new CloudinaryController();

router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  cloudinaryController.uploadFile(req, res);
});
router.delete("/delete", (req: Request, res: Response) => {
  cloudinaryController.deleteFile(req, res);
});

export default router;
