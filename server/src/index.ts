import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import "./config/db";

import authRoutes from "./routes/auth.route";
import fileRoutes from "./routes/auth.route";

const app = express();
const PORT = process.env.PORT || 9001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Filebox api is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/file", fileRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
