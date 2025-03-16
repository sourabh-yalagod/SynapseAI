import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URL || "");
  } catch (error) {
    process.exit(1);
  }
};
