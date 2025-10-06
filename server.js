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
    'http://localhost:8000',
    'https://girlsmagnet.netlify.app'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes - ALL with /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/techniques", techniqueRoutes);
app.use("/api/mistakes", mistakeRoutes); 
app.use("/api/solutions", solutionRoutes);
app.use("/api/videos", videoRoutes);
app.use('/api/screenshots', screenshotRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);