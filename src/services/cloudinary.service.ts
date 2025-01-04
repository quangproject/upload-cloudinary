import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse
} from "cloudinary";
import { CloudinaryConfig } from "../config/cloudinary.config";
import { ResourceType } from "../type";

export class CloudinaryService {
  constructor() {
    // Ensure Cloudinary is initialized (you can also remove this if already initialized)
    CloudinaryConfig.getInstance();
  }

  async uploadFile(
    filePath: string,
    options: UploadApiOptions
  ): Promise<UploadApiResponse> {
    try {
      const result = await cloudinary.uploader.upload(filePath, options);
      return result;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  }

  async deleteFile(
    publicId: string,
    resourceType: ResourceType
  ): Promise<{ result: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      });
      return result;
    } catch (error) {
      console.error("Error deleting file from Cloudinary:", error);
      throw error;
    }
  }

  async getFileUrl(
    publicId: string,
    resourceType: ResourceType
  ): Promise<string> {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: resourceType
      });
      return result.secure_url;
    } catch (error) {
      console.error("Error retrieving file URL:", error);
      throw error;
    }
  }
}
