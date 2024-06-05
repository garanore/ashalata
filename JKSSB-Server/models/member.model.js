// member.model.js
const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    BranchMember: { type: String },
    CenterIDMember: { type: String },
    CenterNameMember: { type: String },
    memberID: { type: String, unique: true, required: true },
    AdmissionDate: { type: String, default: null },
    memberName: { type: String, required: true },
    MfhName: { type: String, required: true },
    memberJob: { type: String, required: true },
    memberVillage: { type: String, required: true },
    memberUnion: { type: String, required: true },
    memberPost: { type: String, required: true },
    memberSubDic: { type: String, required: true },
    MdateOfBirth: { type: String, default: null },
    memberDic: { type: String, required: true },
    memberMarital: { type: String, required: true },
    memberStudy: { type: String, required: true },
    memberFhead: { type: String, required: true },
    memberfMM: { type: String, required: true },
    memberfMF: { type: String, required: true },
    memberfMTotal: { type: String, required: true },
    EarningMember: { type: String, required: true },
    FamilyMemberENO: { type: String, required: true },
    loanamount: { type: String },
    nonorganizaiotnloan: { type: String },
    YearlyIncome: { type: String, required: true },
    LandProperty: { type: String, required: true },
    TotalMoney: { type: String, required: true },
    MemberNIDnumber: { type: String, required: true },
    MemberMobile: { type: String, required: true },
    NominiName: { type: String, required: true },
    NominiFather: { type: String, required: true },
    MemberNominiRelation: { type: String, required: true },
    AdmissionFee: { type: Number, required: true },
    FormFee: { type: Number, required: true },
    agreementChecked: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
