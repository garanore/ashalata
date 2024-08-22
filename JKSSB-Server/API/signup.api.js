const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { ObjectId } = require("mongoose").Types;

router.post("/signup", async (req, res) => {
  try {
    const { phoneNumber, username, password, designation, accountName } =
      req.body;

    // Check if username is already taken
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Check if phone number is already taken
    const existingUserByPhoneNumber = await User.findOne({ phoneNumber });
    if (existingUserByPhoneNumber) {
      return res.status(400).json({ message: "Phone number already taken" });
    }

    const newUser = new User({
      phoneNumber,
      username,
      password,
      designation,
      accountName,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", accountName });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
