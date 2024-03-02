// models/user.model.js
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  rank: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
