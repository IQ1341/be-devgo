import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import projectRoutes from "../routes/project.js";

dotenv.config();

const app = express();

/* ======================
   CORS
====================== */
const allowedOrigins = [
  "http://localhost:4321",
  "http://localhost:3000",
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function (origin, callback) {
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

app.use(express.json());

/* ======================
   ROUTES
====================== */
app.get("/", (req, res) => {
  res.json({ message: "🚀 DevGo API Vercel Ready" });
});

app.use("/api/projects", projectRoutes);

/* ======================
   MONGODB CONNECTION (OPTIMIZED)
====================== */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  console.log("✅ MongoDB Connected");
  return cached.conn;
}

/* ======================
   EXPORT HANDLER (VERCEL)
====================== */
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}