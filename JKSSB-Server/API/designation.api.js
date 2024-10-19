const express = require("express");
const router = express.Router();
const Designation = require("../models/designation.model.js");
const { ObjectId } = require("mongoose").Types;

const multer = require("multer");
const cloudinary = require("../cloudinaryConfig"); // Import Cloudinary config
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Set up Multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "designations", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"], // Image formats allowed
  },
});

const upload = multer({ storage }); // Multer config for file upload

const generateDesignationID = async () => {
  const count = await Designation.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `D${paddedCount}`;
};

router.get("/designation/count", async (req, res) => {
  try {
    const count = await Designation.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching Designation count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Save Designation Information-----------------------------------------------------
router.post(
  "/designation",
  upload.single("designationImage"),
  async (req, res) => {
    try {
      const { DesignationName, submittedBy } = req.body; // Destructure data from req.body

      // Generate a DesignationID (assuming the generateDesignationID function exists)
      const DesignationID = await generateDesignationID();

      // Get the uploaded image URL from Cloudinary
      const imageUrl = req.file.path; // req.file will contain the Cloudinary image info

      // Create a new document using the Designation model
      const designationDocument = new Designation({
        DesignationID,
        DesignationName,
        submittedBy,
        ActiveStatus: "True",
        DeletedBy: "Null",
        image: imageUrl, // Store the Cloudinary URL of the uploaded image
      });

      // Save the document to the database
      await designationDocument.save();

      // Send a success response
      res
        .status(200)
        .json({ message: "Designation saved successfully", imageUrl });
    } catch (error) {
      // Handle any errors during the save operation
      console.error("Error saving designation:", error.message);
      res.status(500).json({ error: "Failed to save designation" });
    }
  }
);

//  Designation callback by ID ----------------------------------------------------------------
router.get("/designation-callback", async (req, res) => {
  try {
    const DesignationIDs = await Designation.find();

    // Send the retrieved dates as a response
    res.status(200).json(DesignationIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

router.get("/designation-callback/:ID", async (req, res) => {
  try {
    const selectedID = req.params.ID; //

    // Filter documents based on the selected ID
    const DesignationIDs = await Designation.find({
      DesignationID: selectedID,
    });

    // Send the retrieved dates as a response
    res.status(200).json(DesignationIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

router.put("/designation/ActiveStatus/:id", async (req, res) => {
  try {
    const { username, deleteDate } = req.body;
    const designationID = req.params.id;

    const Designations = await Designation.findById(designationID);

    if (!Designations) {
      return res
        .status(404)
        .json({ success: false, message: "Designations not found" });
    }

    Designations.ActiveStatus = "False";
    Designations.DeletedBy = username;
    Designations.DeleteDate = deleteDate; // Assuming you have a DeleteDate field in your schema

    await Designations.save();

    res.status(200).json({ message: "Designations updated successfully" });
  } catch (error) {
    console.error("Error updating ActiveStatus:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
