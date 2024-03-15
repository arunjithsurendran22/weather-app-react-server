import express from "express";
import {
  addCurrentLocation,
  getUserLocation,
  addSavedLocation,
  getSavedLocations,
  deleteSavedLocation,
} from "../controllers/controller.js";
import { userAuthorization } from "../middleware/userAuth.Middleware.js";

const router = express.Router();

router.post("/weather-condition/add", userAuthorization, addCurrentLocation);
router.get("/weather-condition/get", userAuthorization, getUserLocation);
router.post("/weather-condition/save-locations/add", userAuthorization, addSavedLocation);
router.get("/weather-condition/save-locations/get", userAuthorization, getSavedLocations);
router.delete("/weather-condition/save-locations/delete/:locationId", userAuthorization, deleteSavedLocation);
export default router;
