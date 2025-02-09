import { v2 as cloudinary, ConfigOptions, UploadApiOptions } from "cloudinary";
import logger from "../utils/logger";
import { ENV } from "./env.config";

export class CloudinaryConfig {
  private static instance: CloudinaryConfig;

  constructor() {
    logger.info("Initializing Cloudinary...");
  }

  static getInstance(): CloudinaryConfig {
    if (!CloudinaryConfig.instance) {
      CloudinaryConfig.instance = new CloudinaryConfig();
    }
    return CloudinaryConfig.instance;
  }

  initialize() {
    const options: ConfigOptions = {
      cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
      api_key: ENV.CLOUDINARY_API_KEY,
      api_secret: ENV.CLOUDINARY_API_SECRET
    };
    cloudinary.config(options);
    logger.info("Cloudinary initialized successfully.");
  }

  getCloudinary() {
    if (!cloudinary.config()) {
      throw new Error("Cloudinary is not configured yet.");
    }
    return cloudinary;
  }

  async uploadFile(filePath: string, options: UploadApiOptions) {
    const result = await cloudinary.uploader.upload(filePath, options);
    return result;
  }

  async deleteFile(publicId: string, resourceType: string) {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  }

  async getFileUrl(publicId: string, resourceType: string) {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType
    });
    return result;
  }
}
