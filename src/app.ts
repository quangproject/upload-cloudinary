import bodyParser from "body-parser";
import express, { Express } from "express";
import morgan from "morgan";
import routes from "./routes/index";
import { CloudinaryConfig } from "./config/cloudinary.config";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("Upload Cloudinary!");
});

// Initialize Cloudinary
new CloudinaryConfig({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

routes(app);

export default app;
