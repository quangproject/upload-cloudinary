import { Request, Response } from "express";
import { CloudinaryService } from "../services/cloudinary.service";
import fs from "fs/promises";
import { DeleteReq, ResourceType, UploadReq } from "../type";
import { InputValidator } from "../utils/validator";

export class CloudinaryController {
  private cloudinaryService: CloudinaryService;

  constructor() {
    this.cloudinaryService = new CloudinaryService();
  }

  async uploadFile(req: Request, res: Response): Promise<Response> {
    try {
      const uploadReq: UploadReq = req.body;
      const validator = new InputValidator(uploadReq);

      // Validate inputs
      validator
        .validateRequired("folder")
        .validateRequired("resourceType")
        .validateLength("folder", 3, 50)
        .validateEnum("resourceType", ["image", "video", "raw"]);

      if (!validator.isValid()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validator.getErrors()
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
      }

      const filePath = req.file.path; // Path to the temporary file
      const { folder, resourceType } = uploadReq;

      const result = await this.cloudinaryService.uploadFile(
        filePath,
        folder,
        resourceType
      );

      // Delete the temporary file after successful upload
      await fs.unlink(filePath);

      return res.status(200).json({
        message: "File uploaded successfully",
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type as ResourceType
        }
      });
    } catch (error) {
      console.error("Error uploading file:", error);

      // Delete temp file even if upload fails
      if (req.file?.path) {
        await fs
          .unlink(req.file.path)
          .catch((unlinkError) =>
            console.error("Failed to delete temp file:", unlinkError)
          );
      }

      return res.status(500).json({ message: "File upload failed", error });
    }
  }

  async deleteFile(req: Request, res: Response): Promise<Response> {
    try {
      const deleteReq: DeleteReq = req.body;
      const validator = new InputValidator(req.body);

      // Validate inputs
      validator
        .validateRequired("publicId")
        .validateRequired("resourceType")
        .validateEnum("resourceType", ["image", "video", "raw"]);

      if (!validator.isValid()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validator.getErrors()
        });
      }

      const { publicId, resourceType } = deleteReq;

      const result = await this.cloudinaryService.deleteFile(
        publicId,
        resourceType
      );

      if (result.result !== "ok") {
        return res
          .status(404)
          .json({ message: "File not found or already deleted." });
      }

      return res.status(200).json({ message: "File deleted successfully." });
    } catch (error) {
      console.error("Error deleting file:", error);
      return res.status(500).json({ message: "File deletion failed.", error });
    }
  }
}
