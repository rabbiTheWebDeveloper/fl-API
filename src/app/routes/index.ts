import express from "express";
import categorysRoute from "../modules/Category/category.router";
import bannersRoute from "../modules/Banner/banner.router";
import sliderRoute from "../modules/slider/slider.router";
import productRoute from "../modules/Product/product.router";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/product",
    route: productRoute,
  },
  {
    path: "/category",
    route: categorysRoute,
  },
  {
    path: "/banner",
    route: bannersRoute,
  },
  {
    path: "/slider",
    route: sliderRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
