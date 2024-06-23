import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://joyduliajan:cV8EB49pVxfoyOys@onchaincluster.thbcnae.mongodb.net/UserDB?retryWrites=true&w=majority&appName=onchainCluster";

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
