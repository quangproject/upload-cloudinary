import bodyParser from "body-parser";
import express, { Express } from "express";
import morgan from "morgan";
import { CloudinaryConfig } from "./config/cloudinary.config";
import { routes } from "./routes";
import { httpExceptionFilter } from "./utils/exception";

const app: Express = express();

// Initialize Cloudinary
const cloudinaryConfig = CloudinaryConfig.getInstance();
cloudinaryConfig.initialize();

app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("Upload Cloudinary!");
});

routes(app);

app.use(httpExceptionFilter);

export default app;
