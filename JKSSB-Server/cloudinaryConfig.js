const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dp6ncgsyw", // Replace with your Cloud Name
  api_key: "558268221922666", // Replace with your API Key
  api_secret: "3DP9KT2uBQqhXuCqx0u_4ARbBAE", // Replace with your API Secret
});

module.exports = cloudinary;
