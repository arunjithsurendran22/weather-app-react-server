import express from "express";
import userProfileRoutes from "./profile.Route.js";
import userWeatherRoute from "./weather.Route.js";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/profile",
    route: userProfileRoutes,
  },
  {
    path: "/weather",
    route: userWeatherRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
