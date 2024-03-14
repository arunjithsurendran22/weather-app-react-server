import { userModel } from "../models/model.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessTokenUserSecret = process.env.USER_JWT_SECRET;
const refreshTokenUserSecret = process.env.USER_REFRESH_TOKEN_SECRET;

// POST: Register user endpoint
const registerUser = async (req, res, next) => {
  try {
    const { name, phone, email, password } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Validate phone number format
    if (phone && phone.length !== 10) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    // Validate input fields
    if (!email || !password || password.length < 6) {
      return res.status(400).json({
        message:
          "Email and password are required. Password must be at least 6 characters long.",
      });
    }

    // Check if phone number already registered
    const existingPhone = await userModel.findOne({ phone });
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    // Check if email already registered
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const user = await userModel.create({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "Registered successfully", user });
  } catch (error) {
    next(error);
    console.error("Error in registerUser:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST: Login user endpoint
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the password is correct
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const accessTokenUser = jwt.sign(
      { id: user._id, email: user.email },
      accessTokenUserSecret,
      { expiresIn: "1d" }
    );
    const refreshTokenUser = jwt.sign(
      { id: user._id, email: user.email },
      refreshTokenUserSecret,
      { expiresIn: "30d" }
    );

    // Set tokens as cookies and header
    res.cookie("accessTokenUser", accessTokenUser, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.cookie("refreshTokenUser", refreshTokenUser, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.setHeader("Authorization", `Bearer ${accessTokenUser}`);

    return res.status(200).json({
      message: "User Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      accessTokenUser: accessTokenUser,
      refreshTokenUser: refreshTokenUser,
    });
  } catch (error) {
    next(error);
    console.error("Error in loginUser:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET: User profile endpoint
const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req;

    // Retrieve user profile
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude sensitive information
    const userProfile = { _id: user._id, email: user.email, role: user.role };
    return res
      .status(200)
      .json({ message: "User profile retrieved successfully", userProfile });
  } catch (error) {
    next(error);
    console.error("Error in getUserProfile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST: Logout user endpoint
const logoutUser = async (req, res, next) => {
  try {
    // Clear cookies
    res.clearCookie("accessTokenUser");
    res.clearCookie("refreshTokenUser");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
    console.error("Error in logoutUser:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser, loginUser, getUserProfile, logoutUser };
