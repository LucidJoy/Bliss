import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
  },
  walletId: {
    type: String,
    required: true,
  },
  cardHash: {
    type: String,
    required: true,
  },
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
