import mongoose from "mongoose";
import "dotenv/config";



const URL = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("Connection with DB is ok.");
  } catch (error) {
    console.log("Connection with DB failed:", error);
    process.exit(1);  // Sal de inmediato si no puedes conectarte
  }
};

export default connectDB;
