const express = require("express");
const router = express.Router();
const Member = require("../models/member.model.js");
const { ObjectId } = require("mongoose").Types;
// For Generate ID
const generateMemberID = async () => {
  const count = await Member.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `M${paddedCount}`;
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

// For Save Member Data ----------------------------------------------------

router.post("/memberdmission", async (req, res) => {
  try {
    const memberData = req.body;
    const memberID = await generateMemberID();
    memberData.agreementChecked = memberData.agreementChecked === "true";
    memberData.memberID = memberID;

    const newMember = new Member(memberData);

    await newMember.save();
    res.status(201).json({ message: "Member data saved successfully" });
  } catch (error) {
    console.error("Error saving member data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//member callback-------------------------------

router.get("/member-callback", async (req, res) => {
  try {
    const selectedCenter = req.query.selectedCenter;
    const selectedNID = req.query.selectedNID;
    let query = {};

    if (selectedCenter) {
      query = { CenterIDMember: selectedCenter };
    }
    if (selectedNID) {
      query.MemberNIDnumber = selectedNID;
    }
    const members = await Member.find(
      query,
      "BranchMember  CenterIDMember CenterNameMember memberID AdmissionDate memberName MfhName MdateOfBirth memberJob memberVillage memberUnion memberPost memberSubDic memberDic memberMarital memberStudy memberFhead memberfMM memberfMF memberfMTotal EarningMember FamilyMemberENO loanamount nonorganizaiotnloan YearlyIncome LandProperty TotalMoney MemberNIDnumber MemberMobile NominiName NominiFather MemberNominiRelation AdmissionFee FormFee "
    );
    res.json(members);
  } catch (error) {
    console.error("Member Application Error:", error.message);
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
      "BranchMember CenterIDMember CenterNameMember memberID AdmissionDate memberName MfhName MdateOfBirth memberJob memberVillage memberUnion memberPost memberSubDic memberDic memberMarital memberStudy memberFhead memberfMM memberfMF memberfMTotal EarningMember FamilyMemberENO loanamount nonorganizationloan YearlyIncome LandProperty TotalMoney MemberNIDnumber MemberMobile NominiName NominiFather MemberNominiRelation AdmissionFee FormFee"
    );

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res.json(member);
  } catch (error) {
    console.error("Member Application Error:", error.message);
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
    const selectedID = req.params.BranchMember; //

    // Filter documents based on the selected ID
    const BranchMembers = await Member.find({
      BranchMember: selectedID,
    });

    // Send the retrieved dates as a response
    res.status(200).json(BranchMembers);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
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

//Member Update-----------------------------------------

router.put("/member-callback/:ID", async (req, res) => {
  try {
    const memberID = req.params.ID; // Retrieve memberID from route parameter
    const query = { _id: new ObjectId(memberID) };
    const updatedData = req.body;

    console.log("Update Query:", query);
    console.log("Updated Data:", updatedData); // Check if CenterMember is present

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

module.exports = router;
