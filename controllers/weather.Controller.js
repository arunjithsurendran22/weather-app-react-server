import { userModel } from "../models/model.js";
import nodemailer from 'nodemailer';
import axios from 'axios';

// POST: user post place name endpoint
const addCurrentLocation = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { location } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the user by userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's location
    user.location = location;
    await user.save();

    return res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    next(error);
    console.error("Error in location:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET: Get user location by userId endpoint
const getUserLocation = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the user by userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve user's location
    const location = user.location;
  

    return res
      .status(200)
      .json({ message: "User location retrieved successfully", location });
  } catch (error) {
    next(error);
    console.error("Error in getUserLocation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST: user add saved location endpoint
const addSavedLocation = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the user by userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the title already exists in the user's savedLocations array
    const existingLocation = user.savedLocations.find(
      (location) => location.title === title
    );
    if (existingLocation) {
      return res.status(400).json({ message: "Location already exists" });
    }

    // Add the saved location to the user's savedLocations array
    user.savedLocations.push({ title });
    await user.save();

    return res
      .status(200)
      .json({ message: "location added successfully" });
  } catch (error) {
    next(error);
    console.error("Error in addSavedLocation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET: Get user's saved locations by userId endpoint
const getSavedLocations = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the user by userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve user's savedLocations
    const savedLocations = user.savedLocations;

    return res.status(200).json({
      message: "User's saved locations retrieved successfully",
      savedLocations,
    });
  } catch (error) {
    next(error);
    console.error("Error in getSavedLocations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE: Delete a saved location by its ID
const deleteSavedLocation = async (req, res, next) => {
  try {
    const userId = req.userId;
    const locationId = req.params.locationId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the user by userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await userModel.findByIdAndUpdate(userId, { $pull: { savedLocations: { _id: locationId } } });

    return res.status(200).json({ message: "Saved location deleted successfully" });
  } catch (error) {
    next(error);
    console.error("Error in deleteSavedLocation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export {
  addCurrentLocation,
  getUserLocation,
  addSavedLocation,
  getSavedLocations,
  deleteSavedLocation,
};
