import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { CloudinaryConfig } from "../config/cloudinary.config";
import { DeleteReq, GetFileUrlReq, ResourceType } from "../type";
import { HttpException } from "../exceptions/http.exception";
import { HTTP_STATUS_CODE } from "../constant";

export class CloudinaryService {
  private cloudinaryConfig: CloudinaryConfig;

  constructor() {
    this.cloudinaryConfig = CloudinaryConfig.getInstance();
  }

  async uploadFile(
    filePath: string,
    options: UploadApiOptions
  ): Promise<UploadApiResponse> {
    const result = await this.cloudinaryConfig
      .getCloudinary()
      .uploader.upload(filePath, options);
    return result;
  }

  async deleteFile(deleteReq: DeleteReq): Promise<string> {
    const { publicId, resourceType } = deleteReq;

    const result = await this.cloudinaryConfig
      .getCloudinary()
      .uploader.destroy(publicId, {
        resource_type: resourceType
      });

    if (result.result !== "ok") {
      throw new HttpException(
        "File not found or already deleted",
        HTTP_STATUS_CODE.NOT_FOUND
      );
    }

    return "File deleted successfully";
  }

  async getFileUrl(getFileUrlReq: GetFileUrlReq): Promise<string> {
    try {
      const { publicId, resourceType } = getFileUrlReq;

      const result = await this.cloudinaryConfig
        .getCloudinary()
        .api.resource(publicId, {
          resource_type: resourceType
        });

      return result;
    } catch (error: any) {
      throw new HttpException(error.error.message, error.error.http_code);
    }
  }
}
