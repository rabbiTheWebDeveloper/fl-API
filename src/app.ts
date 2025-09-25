import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import { dbConnection } from "./app/utlis/dbConnection";
import productRoute from "./app/modules/Product/product.router";
import userRoute from "./app/modules/User/user.router";
import bannerRoute from "./app/modules/Banner/banner.router";
import blogRoute from "./app/modules/Blog/blog.router";
import orderRoute from "./app/modules/Order/order.router";
import reviewRoute from "./app/modules/Review/review.router";
import contactRoute from "./app/modules/ContactUs/contactus.router";
import settingRoute from "./app/modules/Settings/settings.router";
import categorysRoute from "./app/modules/Category/category.router";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import bodyParser from "body-parser";

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

app.use("/api/v1/product", productRoute);
app.use("/api/v1/category", categorysRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", bannerRoute);
app.use("/api/v1", blogRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1", settingRoute);

app.use(globalErrorHandler);

export default app;
