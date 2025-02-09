import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { CloudinaryConfig } from "../config/cloudinary.config";
import { DeleteReq, GetFileUrlReq, ResourceType, UploadReq } from "../type";
import { HttpException } from "../exceptions/http.exception";
import { HTTP_STATUS_CODE } from "../constant";
import { getFileFormat } from "../utils";

export class CloudinaryService {
  private cloudinaryConfig: CloudinaryConfig;

  constructor() {
    this.cloudinaryConfig = CloudinaryConfig.getInstance();
  }

  async uploadFile(
    file: Express.Multer.File,
    uploadReq: UploadReq
  ): Promise<any> {
    const { path, mimetype, originalname } = file;
    const { folder, resourceType } = uploadReq;

    const options: UploadApiOptions = {
      folder,
      public_id: `${Date.now()}-${originalname}`,
      filename_override: originalname,
      resource_type: resourceType,
      format: getFileFormat(mimetype)
    };

    const result: UploadApiResponse = await this.cloudinaryConfig.uploadFile(
      path,
      options
    );

    return {
      public_id: result.public_id,
      original_filename: result.original_filename,
      format: result.format || getFileFormat(mimetype),
      secure_url: result.secure_url,
      resource_type: result.resource_type as ResourceType
    };
  }

  async deleteFile(deleteReq: DeleteReq): Promise<string> {
    const { publicId, resourceType } = deleteReq;

    const result = await this.cloudinaryConfig.deleteFile(
      publicId,
      resourceType
    );

    if (result.result !== "ok") {
      throw new HttpException(
        "File not found or already deleted",
        HTTP_STATUS_CODE.NOT_FOUND
      );
    }

    return "File deleted successfully";
  }

  async getFileUrl(getFileUrlReq: GetFileUrlReq): Promise<any> {
    try {
      const { publicId, resourceType } = getFileUrlReq;

      const result = await this.cloudinaryConfig.getFileUrl(
        publicId,
        resourceType
      );

      return result;
    } catch (error: any) {
      const { message, http_code } = error.error;
      throw new HttpException(message, http_code);
    }
  }
}
