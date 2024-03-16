import axios from "axios";
import nodemailer from "nodemailer";
import cron from "node-cron";
import userModel from "../models/user.Model.js";
import dotenv from "dotenv";

dotenv.config();

const appPassword = process.env.APP_PASSWORD;
const gmail = process.env.GMAIL;
console.log(appPassword);
console.log(gmail);

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmail,
    pass: appPassword,
  },
});

// Function to fetch weather data from WeatherAPI
async function fetchWeatherData(location) {
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=fc0f79a144e9415ca3f70223241003&q=${location}&aqi=no`
    );
    console.log(response.data);
    return response.data; // Return the weather data
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw error; // Throw the error for handling
  }
}

// Function to send weather emails
async function sendWeatherEmail(userEmail, location, weatherData) {
  try {
    // Prepare email content
    const emailContent = `Weather in ${location}: Temperature: ${weatherData.current.temp_c}°C, Condition: ${weatherData.current.condition.text}`;

    // Email message object
    const mailOptions = {
      from: gmail,
      to: userEmail,
      subject: "Daily Weather Update",
      text: emailContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Weather email sent successfully");
  } catch (error) {
    console.error("Error sending weather email:", error);
  }
}

// Schedule the task to run every day at 12 PM, excluding Sundays
cron.schedule("0 12 * * 1-6", async () => {
  // 1-6 represents Monday to Saturday
  try {
    // Fetch users who have saved locations
    const users = await userModel.find({
      savedLocations: { $exists: true, $not: { $size: 0 } },
    });

    // Iterate through each user and send weather emails for their saved locations
    for (const user of users) {
      for (const locationObj of user.savedLocations) {
        const location = locationObj.title;
        const weatherData = await fetchWeatherData(location);
        await sendWeatherEmail(user.email, location, weatherData);
      }
    }
  } catch (error) {
    console.error("Error processing weather notifications:", error);
  }
});

export default userModel;
