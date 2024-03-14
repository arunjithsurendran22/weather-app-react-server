import express from "express";
import userProfileRoutes from "./profile.Route.js";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/profile", 
    route: userProfileRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
