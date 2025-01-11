import app from "./app";
import { ENV } from "./config/env.config";
import logger from "./utils/logger";

const port = Number(ENV.PORT);

const main = async () => {
  try {
    app.listen(port, "::", () => {
      logger.info(`Express server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error starting the server:", err);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  logger.info("Shutting down server...");
  process.exit(0);
});

main();
