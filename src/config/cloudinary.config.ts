import { v2 as cloudinary, ConfigOptions } from "cloudinary";

export class CloudinaryConfig {
  constructor(private options: ConfigOptions) {
    // cloudinary.config({
    //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    //   api_key: process.env.CLOUDINARY_API_KEY,
    //   api_secret: process.env.CLOUDINARY_API_SECRET
    // });
    this.initialize();
  }

  private initialize() {
    cloudinary.config(this.options);
  }

  static getInstance() {
    if (!cloudinary.config()) {
      throw new Error("Cloudinary is not configured yet.");
    }
    return cloudinary;
  }
}
