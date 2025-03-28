const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:8080",
		credentials: true,
	})
);

// Middleware
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
console.log("Attempting to connect to MongoDB with URI:", MONGODB_URI);

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Successfully connected to MongoDB Atlas"))
	.catch((err) => {
		console.error("MongoDB connection error:", err);
		console.error("Please check your MONGODB_URI in .env file");
	});

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
