const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongoose").Types;

router.post("/login", async (req, res) => {
  const { loginInfo, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username: loginInfo }, { phoneNumber: loginInfo }],
    });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      accountName: user.accountName,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//User Check-------------------------

// API to check if there are any users
router.get("/has-users", async (req, res) => {
  try {
    const userCount = await User.countDocuments({});
    res.status(200).json({ hasUsers: userCount > 0 });
  } catch (error) {
    console.error("Error checking user count:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
