import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import projectRoutes from "./routes/project.js";

dotenv.config();

const app = express();

/* ======================
   CORS CONFIG (SMART)
====================== */
const allowedOrigins = [
  "http://localhost:4321",        // Astro dev
  "http://localhost:3000",        // Optional
  process.env.FRONTEND_URL        // Railway / Production
];

app.use(cors({
  origin: function (origin, callback) {
    // allow server-to-server / postman / curl
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

/* ======================
   BODY PARSER
====================== */
app.use(express.json());

/* ======================
   ROUTES
====================== */
app.get("/", (req, res) => {
  res.json({ message: "🚀 DevGo Backend API is running" });
});

app.use("/api/projects", projectRoutes);

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) =>
    console.error("❌ MongoDB Connection Error:", err)
  );
