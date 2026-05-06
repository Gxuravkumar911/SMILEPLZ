const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("Error: JWT_SECRET is not defined in the environment variables.");
  process.exit(1);
}

const app = express();

const corsOriginEnv = process.env.CORS_ORIGINS;
const corsConfig = corsOriginEnv
  ? {
      origin: corsOriginEnv.split(",").map((s) => s.trim()),
      credentials: true,
    }
  : { origin: true, credentials: true };
app.use(cors(corsConfig));

app.use(express.json({ limit: "100kb" }));

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

const buildPath = path.join(__dirname, "..", "frontend", "build");
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(buildPath, "index.html"));
  });
  console.log(`Serving frontend build from ${buildPath}`);
} else {
  app.get("/", (_req, res) =>
    res.send("smileplz API is running (frontend build not found — dev mode)")
  );
}

app.use((err, _req, res, _next) => {
  console.error("Global error:", err.message);
  const isProd = process.env.NODE_ENV === "production";
  res.status(err.status || 500).json({
    message: isProd ? "Internal server error" : err.message,
  });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
