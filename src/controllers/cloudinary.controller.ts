import { NextFunction, Request, Response } from "express";
import { CloudinaryService } from "../services/cloudinary.service";
import fs from "fs/promises";
import {
  ApiResponse,
  DeleteReq,
  GetFileUrlReq,
  ResourceType,
  UploadReq
} from "../type";
import { InputValidator } from "../utils/validator";
import { UploadApiOptions } from "cloudinary";
import { getFileFormat } from "../utils";
import { HttpException } from "../exceptions/http.exception";
import { HTTP_STATUS_CODE } from "../constant";

export class CloudinaryController {
  private cloudinaryService: CloudinaryService;

  constructor() {
    this.cloudinaryService = new CloudinaryService();
  }

  uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ApiResponse> => {
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
        throw new HttpException(
          JSON.stringify(validator.getErrors()),
          HTTP_STATUS_CODE.BAD_REQUEST
        );
      }

      if (!req.file) {
        throw new HttpException(
          "No file provided",
          HTTP_STATUS_CODE.BAD_REQUEST
        );
      }

      const result = await this.cloudinaryService.uploadFile(
        req.file,
        uploadReq
      );

      return {
        message: "File uploaded successfully",
        data: result
      };
    } catch (error) {
      throw error;
    } finally {
      // Delete the temporary file after uploading
      if (req.file) {
        await fs.unlink(req.file.path);
      }
    }
  };

  deleteFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ApiResponse> => {
    const deleteReq: DeleteReq = req.body;
    const validator = new InputValidator(deleteReq);

    // Validate inputs
    validator
      .validateRequired("publicId")
      .validateRequired("resourceType")
      .validateEnum("resourceType", ["image", "video", "raw"]);

    if (!validator.isValid()) {
      throw new HttpException(
        JSON.stringify(validator.getErrors()),
        HTTP_STATUS_CODE.BAD_REQUEST
      );
    }

    const result = await this.cloudinaryService.deleteFile(deleteReq);

    return {
      message: result
    };
  };

  getFileUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ApiResponse> => {
    const getFileUrlReq: GetFileUrlReq = req.body;
    const validator = new InputValidator(getFileUrlReq);

    // Validate inputs
    validator
      .validateRequired("publicId")
      .validateRequired("resourceType")
      .validateEnum("resourceType", ["image", "video", "raw"]);

    if (!validator.isValid()) {
      throw new HttpException(
        JSON.stringify(validator.getErrors()),
        HTTP_STATUS_CODE.BAD_REQUEST
      );
    }

    const result = await this.cloudinaryService.getFileUrl(getFileUrlReq);

    return {
      message: "File URL retrieved successfully",
      data: result
    };
  };
}
