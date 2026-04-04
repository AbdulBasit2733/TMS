import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import { PORT, CLIENT_URL, isProd } from "./config/config";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: isProd
      ? (CLIENT_URL ?? "https://tms-frontend-12ai.onrender.com")
      : "http://localhost:3000",
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
