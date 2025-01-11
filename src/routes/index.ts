import { Express } from "express";
import cloudinaryRouter from "./cloudinary.route";
import { basicAuth } from "../middlewares/basic.middleware";

export function routes(app: Express) {
  app.use("/api/cloudinary", basicAuth, cloudinaryRouter);
}
