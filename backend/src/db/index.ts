import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()


export const ConnectDB = async () => {
    try {
        console.log("MongoDB connecting...", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/myAppDB");
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }   
}