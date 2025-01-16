const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// Check if MONGO_URI is available in the environment
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in the environment variables.");
  process.exit(1); // Exit the application if the MONGO_URI is not set
}

const app = express(); // Initialize the app

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes (after app initialization)
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes); // Define user routes

// Database Connection with enhanced error handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error: ", err.message);
    process.exit(1); // Exit the application if MongoDB connection fails
  });

// Test Route
app.get("/", (req, res) => res.send("SmileToEarn Backend is running"));

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global Error: ", err.message); // Log the error message
  console.error(err.stack); // Log the full stack trace for debugging
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Catch uncaught errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception: ", err.message);
  console.error(err.stack);
  process.exit(1); // Exit the process in case of uncaught exceptions
});

// Catch unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection: ", err.message);
  console.error(err.stack);
  process.exit(1); // Exit the process in case of unhandled promise rejections
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
