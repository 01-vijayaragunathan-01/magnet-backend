// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import techniqueRoutes from "./routes/techniqueRoutes.js";
import mistakeRoutes from "./routes/mistakeRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import screenshotRoutes from './routes/screenshotRoutes.js';
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://girlsmagnet.netlify.app/'  // Replace with YOUR Netlify URL
  ],
  credentials: true
}));
app.use(express.json()); // Essential for parsing req.body

// Routes
app.use("/auth", authRoutes);
app.use("/api/techniques", techniqueRoutes);
app.use("/api/mistakes", mistakeRoutes); 
app.use("/api/solutions", solutionRoutes);
app.use("/api/videos", videoRoutes);
app.use('/api/screenshots', screenshotRoutes);
// app.use('/api/videos', require('./routes/videoRoutes'));

// Connect MongoDB Atlas
mongoose
  // Mongoose 6+ automatically handles these options.
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔥 Server running on http://localhost:${PORT}`)
);
