import { Request, Response } from "express";
import { CloudinaryService } from "../services/cloudinary.service";
import fs from "fs/promises";
import { DeleteReq, GetFileUrlReq, ResourceType, UploadReq } from "../type";
import { InputValidator } from "../utils/validator";
import { UploadApiOptions } from "cloudinary";
import { getFileFormat } from "../utils";

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

      const { path: filePath, mimetype: mimeType } = req.file;
      const { folder, resourceType } = uploadReq;

      const options: UploadApiOptions = {
        folder,
        resource_type: resourceType,
        format: getFileFormat(mimeType)
      };

      const result = await this.cloudinaryService.uploadFile(filePath, options);

      // Delete the temporary file after successful upload
      await fs.unlink(filePath);

      return res.status(200).json({
        message: "File uploaded successfully",
        data: {
          public_id: result.public_id,
          original_filename: result.original_filename,
          format: result.format || getFileFormat(mimeType),
          secure_url: result.secure_url,
          resource_type: result.resource_type as ResourceType
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
      const validator = new InputValidator(deleteReq);

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

  async getFileUrl(req: Request, res: Response): Promise<Response> {
    try {
      const getFileUrlReq: GetFileUrlReq = req.body;
      const validator = new InputValidator(getFileUrlReq);

      // Validate inputs
      validator
        .validateRequired("publicId")
        .validateRequired("resourceType")
        .validateEnum("resourceType", ["image", "video", "raw"]);

      if (!validator.isValid()) {
        return res.status(400).json({ errors: validator.getErrors() });
      }

      const { publicId, resourceType } = getFileUrlReq;

      const url = await this.cloudinaryService.getFileUrl(
        publicId,
        resourceType
      );
      return res
        .status(200)
        .json({ message: "File URL retrieved successfully", url });
    } catch (error) {
      console.error("Error retrieving file URL:", error);
      return res
        .status(500)
        .json({ message: "Failed to retrieve file URL", error });
    }
  }
}
