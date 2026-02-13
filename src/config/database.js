import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUrl);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error MongoDB", error);
  }
};
