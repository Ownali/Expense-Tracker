import mongoose from 'mongoose';
 export const dbConnection = () => 
  {
    try {
    mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected successfully ✓");
  }
    catch (err) {
        console.error("Database connection error:", err.message);
        process.exit(1);
    }
  }
  