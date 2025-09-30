const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration
const additionalOrigins = (process.env.ADDITIONAL_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const devOrigins =
  process.env.NODE_ENV === "production"
    ? []
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
      ];
const allowedOrigins = Array.from(
  new Set([
    process.env.FRONTEND_URL || "http://localhost:3000",
    ...devOrigins,
    ...additionalOrigins,
  ])
);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser tools
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Behind proxies (e.g., Render/Heroku/NGINX)
app.set("trust proxy", 1);

// Basic rate limiting (skip heavy image proxy endpoint)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 1200),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Allow cover images to bypass limiter to avoid 429s when many cards load
    const url = req.originalUrl || req.url || "";
    return /\/api\/blog\/posts\/[0-9a-fA-F]{24}\/cover(?:\?|$)/.test(url);
  },
});
app.use("/api/", apiLimiter);

// Tighter limits for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(
  ["/api/auth/login", "/api/auth/register", "/api/auth/firebase"],
  authLimiter
);

// Sanitize inputs against NoSQL injection
app.use(mongoSanitize());

// Middleware (increase JSON limit for base64 image payloads)
const JSON_LIMIT = process.env.JSON_BODY_LIMIT || "5mb";
app.use(express.json({ limit: JSON_LIMIT }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET - refusing to start.");
  process.exit(1);
}
console.log("Attempting to connect to MongoDB...");

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Successfully connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.error("Please check your MONGODB_URI in .env file");
  });

// Base API path configurable
const API_BASE = process.env.API_BASE_PATH || "/api";

// Routes
const authRoutes = require("./routes/auth");
app.use(`${API_BASE}/auth`, authRoutes);

// Blog / CMS routes
const blogRoutes = require("./routes/blog");
app.use(`${API_BASE}/blog`, blogRoutes);

// Applications routes
const applicationRoutes = require("./routes/applications");
app.use(`${API_BASE}/applications`, applicationRoutes);

// Consultation requests routes
const consultationRoutes = require("./routes/consultations");
app.use(`${API_BASE}/consultations`, consultationRoutes);

// Mentees routes
const menteeRoutes = require("./routes/mentees");
app.use(`${API_BASE}/mentees`, menteeRoutes);
// Webinars routes
const webinarRoutes = require("./routes/webinars");
app.use(`${API_BASE}/webinars`, webinarRoutes);

// Google OAuth flow (initiates & callback) and Drive access routes
const googleOAuthRoutes = require("./routes/googleOAuth");
app.use(`${API_BASE}/google-oauth`, googleOAuthRoutes);
const googleDriveRoutes = require("./routes/googleDrive");
app.use(`${API_BASE}/google-drive`, googleDriveRoutes);

// Admin management routes (promotions, etc.)
const adminRoutes = require("./routes/admin");
app.use(`${API_BASE}/admin`, adminRoutes);

// Uploads route (now backed by Cloudflare R2 storage)
const uploadRoutes = require("./routes/uploads");
app.use(`${API_BASE}/uploads`, uploadRoutes);

// Health check (lightweight, no DB query to remain fast even if DB down)
app.get(`${API_BASE}/health`, (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
});

// Static file serving for uploaded images
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const BASE_PORT = parseInt(process.env.PORT, 10) || 8008;
function startServer(port, attempt = 0) {
  const server = app.listen(port, () => {
    if (attempt === 0) {
      console.log(`Server is running on port ${port}`);
    } else {
      console.log(`Server recovered on fallback port ${port}`);
    }
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      if (attempt < 5) {
        const nextPort = port + 1;
        console.warn(
          `Port ${port} in use, retrying on ${nextPort} (attempt ${
            attempt + 1
          })`
        );
        setTimeout(() => startServer(nextPort, attempt + 1), 300);
      } else {
        console.error(
          "Exceeded max port attempts. Please free a port starting at",
          BASE_PORT
        );
        process.exit(1);
      }
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
}
startServer(BASE_PORT);
