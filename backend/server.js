import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import categoryRoutes from './routes/categories.js';
import expenseRoutes from './routes/expenses.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// === Route Integration ===
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
// =========================

// Basic Health Check Route
app.get("/", (req, res) => {
    res.send("Expense Tracker API is running 🚀");
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => console.error("❌ MongoDB connection error:", err));