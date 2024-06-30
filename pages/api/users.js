import User from "@/models/user";
import mongoose from "mongoose";

const handler = async (req, res) => {
  const { method } = req;

  await mongoose.connect(process.env.MONGODB_URI);

  // Handle GET requests
  if (method === "GET") {
    const { walletAddress } = req.query;

    // Get single user if walletAddress is provided
    if (walletAddress) {
      try {
        const user = await User.findOne({ walletAddress });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        console.log("USERRR: ", user);
        return res.status(200).json(user);
      } catch (error) {
        console.error("Error getting user:", error);
        return res
          .status(500)
          .json({ error: "Error getting user", details: error.message });
      }
    }
    // Get all users if no walletAddress is provided
    else {
      try {
        const data = await User.find();
        console.log("All users:", data);
        return res.status(200).json({ result: data });
      } catch (error) {
        console.error("Error getting all users:", error);
        return res
          .status(500)
          .json({ error: "Error getting all users", details: error.message });
      }
    }
  }

  // save a user
  if (method === "POST") {
    const { walletAddress, walletId, cardHash } = req.body;

    console.log("walletAddress: ", walletAddress);
    console.log("walletId: ", walletId);
    console.log("cardHash: ", cardHash);

    if (!walletAddress || !walletId || !cardHash) {
      return res
        .status(400)
        .json({ error: "walletAddress, walletId and cardHash are required" });
    }

    try {
      const alreadyPresent = await User.findOne({ walletAddress });
      if (alreadyPresent)
        return res.status(400).json({ error: "User already present." });

      const newUser = new User({ walletAddress, walletId, cardHash });
      await newUser.save();
      return res.json({ message: "User created successfully", user: newUser });
    } catch (error) {
      return res.json({ error: "Error creating user", details: error.message });
    }
  }
};

export default handler;
