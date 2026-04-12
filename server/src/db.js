import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sanun_jara_elite";

export const connectDb = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // stop app if DB fails
  }
};

export const disconnectDb = async () => {
  try {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  } catch (error) {
    console.error("❌ Error disconnecting MongoDB:", error.message);
  }
};