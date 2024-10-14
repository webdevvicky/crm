import mongoose from "mongoose";

const connectMainDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Main DB connected");
  } catch (error) {
    console.error("Error connecting to main DB", error);
    process.exit(1);
  }
};

export default connectMainDB;
