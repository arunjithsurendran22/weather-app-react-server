//import admin profile

import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} from "./profile.Controller.js";

export { registerUser, loginUser, getUserProfile, logoutUser };

import {
  addCurrentLocation,
  getUserLocation,
  addSavedLocation,
  getSavedLocations,
  deleteSavedLocation,
} from "./weather.Controller.js";
export {
  addCurrentLocation,
  getUserLocation,
  addSavedLocation,
  getSavedLocations,
  deleteSavedLocation,
};
