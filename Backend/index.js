const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// CORS configuration
const allowedOrigins = ["https://aeronitkkr.in", `http://localhost:3000`];

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser()); // Add cookie-parser middleware
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connect to MongoDB
const connectToMongo = async () => {
	try {
		const uri = process.env.MONGO_URI; // MongoDB connection URI
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB connected successfully");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};
connectToMongo();

app.get("/", (req, res) => {
	return res.json("hello world of aeromodelling");
});

// Register routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Determine base URL based on environment
const PORT = process.env.PORT || 5000;
const baseURL =
	process.env.NODE_ENV === "production" ? `https://aeronitkkr.in` : `http://localhost:5000`;

// Server listening
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`Base URL: ${baseURL}`);
});
