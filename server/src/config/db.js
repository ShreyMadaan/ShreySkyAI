
import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        dbName: "shreyskyai",
        serverSelectionTimeoutMS: 10000,
      }
    );

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );

    console.log(
      `Database: ${connection.connection.name}`
    );
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
}
