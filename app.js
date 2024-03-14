import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.Route.js";
import errorMiddleware from "./middleware/error.Middleware.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    credentials: true, // Enable cookies with CORS
  })
);

// Enable pre-flight requests for all routes
app.options("*", cors());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  
// Routing
app.use("/api/v1/user", userRoute);
app.use(errorMiddleware); // Error handling middleware

// Server connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
