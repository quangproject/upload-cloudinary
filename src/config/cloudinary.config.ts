import { v2 as cloudinary, ConfigOptions } from "cloudinary";
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
}
