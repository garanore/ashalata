// member.model.js
const mongoose = require("mongoose");
// Define the schema for the member
const memberSchema = new mongoose.Schema(
  {
    // Define fields for the member schema
    BranchMember: { type: String },
    CenterMember: { type: String },
    memberID: { type: String, unique: true },
    memberName: { type: String },
    MfhName: { type: String },
    memberJob: { type: String },
    memberVillage: { type: String },
    memberUnion: { type: String },
    memberPost: { type: String },
    memberSubDic: { type: String },
    MdateOfBirth: { type: String, default: null },
    memberDic: { type: String },
    memberMarital: { type: String },
    memberStudy: { type: String },
    memberFhead: { type: String },
    memberfMM: { type: String },
    memberfMF: { type: String },
    memberfMTotal: { type: String },
    EarningMember: { type: String },
    FamilyMemberENO: { type: String },
    loanamount: { type: String },
    nonorganizaiotnloan: { type: String },
    YearlyIncome: { type: String },
    LandProperty: { type: String },
    TotalMoney: { type: String },
    MemberNIDnumber: { type: String },
    MemberMobile: { type: String },
    NominiName: { type: String },
    NominiFather: { type: String },
    MemberNominiRelation: { type: String },
    agreementChecked: { type: Boolean },
  },
  { timestamps: true }
);

// Create a mongoose model using the schema
const Member = mongoose.model("Member", memberSchema);

// Export the model for use in other files
module.exports = Member;
