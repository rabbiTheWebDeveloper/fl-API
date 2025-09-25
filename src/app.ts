import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import { dbConnection } from "./app/utlis/dbConnection";
import bannerRoute from "./app/modules/Banner/banner.router";
import blogRoute from "./app/modules/Blog/blog.router";
import settingRoute from "./app/modules/Settings/settings.router";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import bodyParser from "body-parser";
import router from "./app/routes";

const app: Application = express();
app.use(cors());

// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(bodyParser.json());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);

// db connection
dbConnection();
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/v1", bannerRoute);
app.use("/api/v1", blogRoute);
app.use("/api/v1", settingRoute);
app.use("/api/v1", router);
app.use(globalErrorHandler);

export default app;
