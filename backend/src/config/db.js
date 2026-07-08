import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("❌ MONGO_URI is not set. Check backend/.env");
  }

  mongoose.set("strictQuery", true);

  try {
    console.log("[db] Connecting to:", uri.replace(/\/\/.*@/, "//<credentials-hidden>@"));

    await mongoose.connect(uri);

    console.log("[db] ✅ Connected to MongoDB");

    mongoose.connection.on("error", (err) => {
      console.error("[db] Connection error:", err.message);
    });
  } catch (err) {
    console.error("[db] ❌ Failed to connect:", err.message);
    throw err;
  }
}