const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  accountName: { type: String, required: true }, // Add this line
  phoneNumber: { type: String, required: true, unique: true }, // Ensure uniqueness,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  designation: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
