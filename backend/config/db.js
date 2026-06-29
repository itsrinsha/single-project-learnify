import mongoose from "mongoose";

const connectDB = async (dbUrl) => {
  try {
    await mongoose.connect(dbUrl);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};

export default connectDB;