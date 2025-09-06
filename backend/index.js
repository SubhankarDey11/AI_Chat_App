import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import chatbotRoutes from './routes/chatbot.route.js';
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // add your frontend domain here
  credentials: true
}));

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.log("❌ Error connecting to MongoDB:", error));

// API Routes
app.use('/bot/v1', chatbotRoutes);

// Deployment setup (only if serving frontend from backend)
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  app.get(/^\/(?!bot\/v1\/).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
