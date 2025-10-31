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

// Parse incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middlewares
app.use(helmet());

// ✅ Custom Express 5 safe sanitizer
app.use((req, res, next) => {
  try {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
    if (req.query) mongoSanitize.sanitize(req.query);
  } catch (err) {
    console.error("Sanitize error:", err);
  }
  next();
});

app.use(hpp());
app.use(bodyParser.json());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000,
});
app.use(limiter);

// DB connection
dbConnection();

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", bannerRoute);
app.use("/api/v1", blogRoute);
app.use("/api/v1", settingRoute);
app.use("/api/v1", router);

// Global error handler
app.use(globalErrorHandler);

export default app;
