require("dotenv").config();

const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { ObjectId } = require("mongoose").Types;
const crypto = require("crypto"); // For generating token
const nodemailer = require("nodemailer"); // For sending emails

router.post("/signup", async (req, res) => {
  try {
    const {
      phoneNumber,
      email,
      username,
      password,
      designation,
      accountName,
      UserBranch,
      UserCenter,
      approvalStatus,
      ActiveStatus,
      submittedBy,
      GrantedBy,
      DeletedBy,
      DeleteDate,
    } = req.body;
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
    // Check if email is already taken
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email  already taken" });
    }

    const newUser = new User({
      phoneNumber,
      email,
      username,
      password,
      designation,
      accountName,
      UserBranch,
      UserCenter,
      approvalStatus,
      ActiveStatus,
      submittedBy,
      GrantedBy,
      DeletedBy,
      DeleteDate,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", accountName });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fro Permissions

router.post("/signup/grant/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body; // Get the username from the request body

    const user = await User.findByIdAndUpdate(
      id,
      {
        approvalStatus: "Granted",
        GrantedBy: username, // Save the username in the GrantedBy field
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.json({ message: "user granted", user });
  } catch (error) {
    console.error("Error granting user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/signup/grant", async (req, res) => {
  try {
    const grantUsers = await User.find({ approvalStatus: "Pending" });
    res.json(grantUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch users with Needs Correction status, optionally filter by submittedBy
router.get("/signup/review", async (req, res) => {
  try {
    const { submittedBy } = req.query;

    // If submittedBy is provided, filter users by it, otherwise fetch all with Needs Correction
    const query = { approvalStatus: "Needs Correction" };
    if (submittedBy) {
      query.submittedBy = submittedBy;
    }

    const users = await User.find(query);
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users needing correction" });
  }
});

// Update users approval status to Needs Correction
router.post("/signup/review/:id", async (req, res) => {
  try {
    const users = await User.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "Needs Correction" },
      { new: true }
    );
    res.json({ message: "users sent back for correction", users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending users back for correction" });
  }
});

router.delete("/signup/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.findByIdAndDelete(id);

    if (!users) {
      return res.status(404).json({ message: "users not found" });
    }

    res.json({ message: "users canceled" });
  } catch (error) {
    console.error("Error canceling users:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get user by phoneNumber----------------------------------------------------------------

router.get("/get-user-phoneNumber/:phoneNumber", async (req, res) => {
  try {
    const selectedUser = req.params.phoneNumber;
    const phoneNumbers = await User.find({ phoneNumber: selectedUser });

    if (phoneNumbers.length > 0) {
      res.status(200).json(phoneNumbers);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Get user by UserBranch----------------------------------------------------------------

router.get("/get-user-UserBranch/:UserBranch", async (req, res) => {
  try {
    const selectedUserBranch = req.params.UserBranch;

    // Check if the selectedUserBranch is "AllUserBranch"
    let query;
    if (selectedUserBranch === "AllUserBranch") {
      // Find users with an empty UserBranch array
      query = { UserBranch: { $size: 0 } };
    } else {
      // Otherwise, find users with the selected UserBranch
      query = { UserBranch: selectedUserBranch };
    }

    const users = await User.find(query);

    if (users.length > 0) {
      res.status(200).json(
        users.map((user) => ({
          ...user._doc,
          UserBranch: user.UserBranch.filter(
            (branch) =>
              branch === selectedUserBranch ||
              selectedUserBranch === "AllUserBranch"
          ),
        }))
      );
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Get User By Branch and Designation Both

router.get("/get-user-branch-designation", async (req, res) => {
  try {
    const { branch, designation } = req.query;

    // Build the query object based on the provided parameters
    let query = {};

    if (branch) {
      if (branch === "AllUserBranch") {
        query.UserBranch = { $size: 0 }; // Find users with an empty UserBranch array
      } else {
        query.UserBranch = branch; // Filter by specific branch
      }
    }

    if (designation) {
      query.designation = designation; // Filter by specific designation
    }

    const users = await User.find(query);

    if (users.length > 0) {
      res.status(200).json(
        users.map((user) => ({
          ...user._doc,
          UserBranch: user.UserBranch.filter(
            (b) => b === branch || branch === "AllUserBranch"
          ),
        }))
      );
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Get user by UserName----------------------------------------------------------------

router.get("/get-user-username/:username", async (req, res) => {
  try {
    const selectedUser = req.params.username;
    const usernames = await User.find({ username: selectedUser });

    if (usernames.length > 0) {
      res.status(200).json(usernames);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Get user by Designation----------------------------------------------------------------

router.get("/get-user-designation/:designation", async (req, res) => {
  try {
    const selectedUser = req.params.designation;
    const designations = await User.find({ designation: selectedUser });

    if (designations.length > 0) {
      res.status(200).json(designations);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

//Get Branch and Center For Users----------------------------------------------------------------

router.get("/get-branch-center/:username", async (req, res) => {
  try {
    const selectedUser = req.params.username;
    const user = await User.findOne({ username: selectedUser });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let userBranchData = {};
    let userCenterData = {};

    if (user.UserBranch.length === 0) {
      userBranchData.UserBranch1 = "AllBranch";
    } else {
      user.UserBranch.forEach((branch, index) => {
        userBranchData[`UserBranch${index + 1}`] = branch;
      });
    }

    if (user.UserCenter.length === 0) {
      userCenterData.UserCenter1 = "AllCenter";
    } else {
      user.UserCenter.forEach((center, index) => {
        userCenterData[`UserCenter${index + 1}`] = center;
      });
    }

    // Add the username to the response
    res.status(200).json({
      username: user.username, // Include username
      ...userBranchData,
      ...userCenterData,
      designation: user.designation,
    });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Update User Details----------------------------------------------------------------

router.put("/update-user/:id", async (req, res) => {
  try {
    const { phoneNumber, designation, accountName, UserBranch, UserCenter } =
      req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        phoneNumber,
        designation,
        accountName,
        UserBranch,
        UserCenter,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/signup/ActiveStatus/:id", async (req, res) => {
  try {
    const { username, deleteDate } = req.body;
    const usernames = req.params.id;

    const branch = await User.findById(usernames);

    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    branch.ActiveStatus = "False";
    branch.DeletedBy = username;
    branch.DeleteDate = deleteDate; // Assuming you have a DeleteDate field in your schema

    await branch.save();

    res.status(200).json({ message: "Branch updated successfully" });
  } catch (error) {
    console.error("Error updating ActiveStatus:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email doesn't exist" });
    }

    // Generate a reset token and expiry date
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour

    await user.save();

    // Nodemailer configuration (use environment variables for credentials)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Use environment variable
        pass: process.env.EMAIL_PASS, // Use environment variable
      },
    });

    const mailOptions = {
      to: user.email,
      from: "no-reply@yourapp.com",
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) requested a password reset for your account.\n\n
      Please click on the following link, or paste it into your browser to complete the process:\n\n
      http://localhost:3000/reset-password/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    // Sending the email
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .json({ message: "Password reset link sent to email" });
      }
    });
  } catch (error) {
    console.error("Error processing password reset:", error);
    return res.status(500).json({ message: "Error processing password reset" });
  }
});

module.exports = router;
