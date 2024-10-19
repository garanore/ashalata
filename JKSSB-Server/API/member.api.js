const express = require("express");
const router = express.Router();
const Member = require("../models/member.model.js");
const { ObjectId } = require("mongoose").Types;

const dotenv = require("dotenv");
// For Generate ID
// const generateMemberID = async () => {
// 	const count = await Member.countDocuments();
// 	const paddedCount = (count + 1).toString().padStart(4, "0");
// 	return `M${paddedCount}`;
// };

// Load environment variables
dotenv.config();

const generateMemberID = async (BranchID) => {
  try {
    const count = await Member.countDocuments({ BranchID: BranchID });
    const paddedCount = (count + 1).toString().padStart(4, "0");
    return `${BranchID}M${paddedCount}`;
  } catch (error) {
    console.error("Error generating Member ID:", error.message);
    throw error; // Rethrow the error to propagate it up
  }
};

router.get("/memberdmission/count", async (req, res) => {
  try {
    const count = await Member.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching branch count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/memberdmission", async (req, res) => {
  try {
    const memberData = req.body;

    // Ensure BranchID is provided in the request body
    const { BranchID } = memberData;

    // Generate MemberID based on the BranchID
    const memberID = await generateMemberID(BranchID);

    // Update memberData with generated MemberID and correct agreementChecked flag
    memberData.agreementChecked = memberData.agreementChecked === "true";
    memberData.memberID = memberID;

    // Create a new member document with the provided data
    const newMember = new Member(memberData);

    // Save the member to the database
    await newMember.save();

    // Send a success response
    res.status(201).json({ message: "Member data saved successfully" });
  } catch (error) {
    console.error("Error saving member data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Pending

// router.post("/memberdmission/approved/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const member = await Member.findByIdAndUpdate(
//       id,
//       { approvalStatus: "Approved" },
//       { new: true }
//     );

//     if (!member) {
//       return res.status(404).json({ message: "member not found" });
//     }

//     res.json({ message: "member pending", member });
//   } catch (error) {
//     console.error("Error approving member:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// router.get("/memberdmission/approved", async (req, res) => {
//   try {
//     const pendingMembers = await Member.find({ approvalStatus: "Pending" });
//     res.json(pendingMembers);
//   } catch (error) {
//     console.error("Error fetching pending members:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// For Granted

// API to handle member admission with image upload

router.post("/memberdmission/granted/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const member = await Member.findByIdAndUpdate(
      id,
      { approvalStatus: "Granted", GrantedBy: username },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ message: "member not found" });
    }

    res.json({ message: "member pending", member });
  } catch (error) {
    console.error("Error approving member:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/memberdmission/granted", async (req, res) => {
  try {
    const pendingMembers = await Member.find({ approvalStatus: "Approved" });
    res.json(pendingMembers);
  } catch (error) {
    console.error("Error fetching pending members:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// for Delete

router.delete("/memberdmission/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({ message: "member not found" });
    }

    res.json({ message: "member canceled" });
  } catch (error) {
    console.error("Error canceling member:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update member approval status to Needs Correction
router.get("/memberdmission/review", async (req, res) => {
  try {
    const { submittedBy } = req.query;

    // If submittedBy is provided, filter centers by it, otherwise fetch all with Needs Correction
    const query = { approvalStatus: "Needs Correction" };
    if (submittedBy) {
      query.submittedBy = submittedBy;
    }

    const centers = await Member.find(query);
    res.json(centers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching centers needing correction" });
  }
});

// Update center approval status to Needs Correction
router.post("/memberdmission/review/:id", async (req, res) => {
  try {
    const center = await Member.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "Needs Correction" },
      { new: true }
    );
    res.json({ message: "Member sent back for Approve", center });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending center back for correction" });
  }
});

//member callback-------------------------------

router.get("/member-callback", async (req, res) => {
  try {
    const selectedCenter = req.query.selectedCenter;
    const selectedNID = req.query.selectedNID;
    let query = { approvalStatus: "Granted" }; // Add approvalStatus to query

    // Add CenterIDMember to query if selectedCenter is provided
    if (selectedCenter) {
      query.CenterIDMember = selectedCenter;
    }

    // Add MemberNIDnumber to query if selectedNID is provided
    if (selectedNID) {
      query.MemberNIDnumber = selectedNID;
    }

    const members = await Member.find(
      query,
      "DeleteDate NominiNID DeletedStatus GrantedBy submittedBy ActiveStatus approvalStatus BranchMember CenterIDMember CenterNameMember memberID AdmissionDate memberName MfhName MdateOfBirth memberJob memberVillage memberUnion memberPost memberSubDic memberDic memberMarital memberStudy memberFhead memberfMM memberfMF memberfMTotal EarningMember FamilyMemberENO loanamount nonorganizaiotnloan YearlyIncome LandProperty TotalMoney MemberNIDnumber MemberMobile NominiName NominiFather MemberNominiRelation AdmissionFee FormFee"
    );
    res.json(members);
  } catch (error) {
    console.error("Member routerlication Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Member ID Get----------------------------------------------------------------

router.get("/member-callback/:ID", async (req, res) => {
  try {
    const memberID = req.params.ID; // Retrieve memberID from route parameter
    const query = { _id: new ObjectId(memberID) };

    const member = await Member.findOne(
      query,
      "BranchMember NominiNID CenterIDMember CenterNameMember memberID AdmissionDate memberName MfhName MdateOfBirth memberJob memberVillage memberUnion memberPost memberSubDic memberDic memberMarital memberStudy memberFhead memberfMM memberfMF memberfMTotal EarningMember FamilyMemberENO loanamount nonorganizationloan YearlyIncome LandProperty TotalMoney MemberNIDnumber MemberMobile NominiName NominiFather MemberNominiRelation AdmissionFee FormFee"
    );

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res.json(member);
  } catch (error) {
    console.error("Member routerlication Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Member Callback By selected Branch --------------------------------

router.get("/member-callback-by-branch", async (req, res) => {
  try {
    const BranchMembers = await Member.find();

    // Send the retrieved dates as a response
    res.status(200).json(BranchMembers);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

router.get("/member-callback-by-branch/:BranchMember", async (req, res) => {
  try {
    const selectedID = req.params.BranchMember;

    // Filter documents based on the selected BranchMember and approvalStatus = "Granted"
    const BranchMembers = await Member.find({
      BranchMember: selectedID,
      approvalStatus: "Granted", // Only select members with approvalStatus "Granted"
    });

    // Send the retrieved members as a response
    res.status(200).json(BranchMembers);
  } catch (error) {
    console.error("Error fetching members:", error.message);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// Member Call Back by MemberID--------------------------------

router.get("/member-callback-by-memberID/:memberID", async (req, res) => {
  try {
    const selectedID = req.params.memberID;

    // Filter documents based on the selected BranchMember and approvalStatus = "Granted"
    const memberIDs = await Member.find({
      memberID: selectedID,
      approvalStatus: "Granted", // Only select members with approvalStatus "Granted"
    });

    // Send the retrieved members as a response
    res.status(200).json(memberIDs);
  } catch (error) {
    console.error("Error fetching members:", error.message);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

//get-AdmissionFee-by-center-and-date

router.get(
  "/get-AdmissionFee-by-center-and-date/:CenterIDMember/:AdmissionDate",
  async (req, res) => {
    try {
      const { CenterIDMember, AdmissionDate } = req.params;

      // Find documents matching the provided OLcenter and AdmissionDate
      const AdmissionFees = await Member.find({
        CenterIDMember: CenterIDMember,
        AdmissionDate: AdmissionDate,
      });

      // Calculate the sum of macroloan values
      const sumAdmissionFees = AdmissionFees.reduce(
        (sum, member) => sum + member.AdmissionFee,
        0
      );
      // Calculate the sum of macroloan values
      const sumFormFee = AdmissionFees.reduce(
        (sum, member) => sum + member.FormFee,
        0
      );

      // Send the result as a JSON response
      res.status(200).json({ sumAdmissionFees, sumFormFee });
    } catch (error) {
      console.error("Error fetching macroloan data:", error.message);
      res.status(500).json({ error: "Failed to fetch macroloan data" });
    }
  }
);

//get AdmissionFee and Form Fee by branch and date

router.get(
  "/get-AdmissionFee-by-branch-and-date/:BranchMember/:AdmissionDate", // Change order here
  async (req, res) => {
    try {
      const { BranchMember, AdmissionDate } = req.params;

      // Query to find documents
      const AdmissionFees = await Member.find({
        BranchMember: BranchMember.trim(),
        AdmissionDate: AdmissionDate.trim(),
      });

      // Calculate the sum of AdmissionFee values
      const sumAdmissionFeesBranch = AdmissionFees.reduce(
        (sum, member) => sum + (member.AdmissionFee || 0),
        0
      );

      // Calculate the sum of FormFee values
      const sumFormFeeBranch = AdmissionFees.reduce(
        (sum, member) => sum + (member.FormFee || 0),
        0
      );

      // Send the result as a JSON response
      res.status(200).json({ sumAdmissionFeesBranch, sumFormFeeBranch });
    } catch (error) {
      console.error("Error fetching admission fee data:", error.message);
      res.status(500).json({ error: "Failed to fetch admission fee data" });
    }
  }
);

//get AdmissionFee and Form Fee by Branch and Month

router.get(
  "/get-AdmissionFee-by-branch-and-month/:BranchMember/:monthYear",
  async (req, res) => {
    try {
      const { BranchMember, monthYear } = req.params;

      // Parse month and year from the parameter (MM-YYYY format)
      const [month, year] = monthYear.split("-");

      // Create a regex pattern to match the AdmissionDate for the entire month
      const monthPattern = new RegExp(`^${year}-${month.padStart(2, "0")}`);

      // Find documents matching the provided BranchMember and AdmissionDate within the month range
      const AdmissionFees = await Member.find({
        BranchMember: BranchMember.trim(),
        AdmissionDate: {
          $regex: monthPattern, // Match dates starting with the given year and month
        },
      });

      // Calculate the sum of AdmissionFee values
      const sumAdmissionFeesBranchMonth = AdmissionFees.reduce(
        (sum, member) => sum + (member.AdmissionFee || 0),
        0
      );

      // Calculate the sum of FormFee values
      const sumFormFeeBranchMonth = AdmissionFees.reduce(
        (sum, member) => sum + (member.FormFee || 0),
        0
      );

      // Send the result as a JSON response
      res
        .status(200)
        .json({ sumAdmissionFeesBranchMonth, sumFormFeeBranchMonth });
    } catch (error) {
      console.error("Error fetching admission fee data:", error.message);
      res.status(500).json({ error: "Failed to fetch admission fee data" });
    }
  }
);

//Member Update-----------------------------------------

router.put("/member-callback/:ID", async (req, res) => {
  try {
    const memberID = req.params.ID;

    // Validate memberID format
    if (!ObjectId.isValid(memberID)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    const query = { _id: new ObjectId(memberID) };
    const updatedData = req.body;

    // Perform update
    const updatedMember = await Member.findOneAndUpdate(
      query,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedMember) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res.json({
      success: true,
      message: "Member updated successfully",
      updatedMember,
    });
  } catch (error) {
    console.error("Member Update Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.put("/memberdmission/ActiveStatus/:id", async (req, res) => {
  try {
    const { username, deleteDate } = req.body; // Extract data from request body
    const memberId = req.params.id; // Get the member ID from the route params

    // Find the member by ID
    const member = await Member.findById(memberId);

    // If member not found, return a 404 response
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    // Update the fields in the member document
    member.ActiveStatus = "False";
    member.DeletedBy = username;
    member.DeleteDate = deleteDate; // Assuming you have a DeleteDate field in your schema

    // Save the updated member document
    await member.save();

    // Return success response
    res.status(200).json({ message: "Member updated successfully" });
  } catch (error) {
    console.error("Error updating ActiveStatus:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
