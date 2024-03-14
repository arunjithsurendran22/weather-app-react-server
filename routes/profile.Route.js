import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} from "../controllers/controller.js";
import { userAuthorization } from "../middleware/userAuth.Middleware.js";

const router = express.Router();

// User Authentication endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", userAuthorization, getUserProfile);
router.post("/logout", userAuthorization, logoutUser);

export default router;
