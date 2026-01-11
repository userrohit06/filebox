import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env");
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MONGODB connected"))
  .catch((err) => {
    console.error("MONGODB connection error:", err);
    process.exit(1);
  });
