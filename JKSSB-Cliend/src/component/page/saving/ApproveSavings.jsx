// // eslint-disable-next-line no-unused-vars
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { useNavigate } from "react-router-dom";

// const ApproveSavings = () => {
//   const [pendingSavings, setPendingSavings] = useState([]);
//   const [error, setError] = useState("");
//   const [Branches, setBranches] = useState([]);
//   const [hasAccess, setHasAccess] = useState(false);
//   const [username, setUsername] = useState(""); // Add username state
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPendingSavins = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/opensaving/approved"
//         );
//         setPendingSavings(response.data);
//       } catch (error) {
//         setError("Error fetching pending Savings");
//       }
//     };

//     fetchPendingSavins();

//     // Retrieve user data from localStorage
//     const storedUserData = localStorage.getItem("BranchData");
//     if (storedUserData) {
//       const parsedData = JSON.parse(storedUserData);

//       // Retrieve branches (if needed for further logic)
//       const branches = Object.keys(parsedData)
//         .filter((key) => key.startsWith("Branch"))
//         .map((key) => parsedData[key]);
//       setBranches(branches);

//       // Retrieve designations from user data
//       const designations = Object.keys(parsedData)
//         .filter((key) => key.startsWith("designation"))
//         .map((key) => parsedData[key]);

//       const userNames = Object.keys(parsedData)
//         .filter((key) => key.startsWith("username"))
//         .map((key) => parsedData[key]);

//       // Assume there is only one username and take the first one
//       const username = userNames.length > 0 ? userNames[0] : "Unknown";
//       setUsername(username); // Set the username in the state

//       // Check if the user has one of the required designations
//       const requiredDesignations = [
//         "শাখা ব্যাবস্থাপক ",
//         "সহকারী শাখা ব্যাবস্থাপক ",
//         "শাখা হিসাব রক্ষক ",
//         "সহকারী শাখা হিসাবরক্ষক",
//       ];
//       const userHasAccess = designations.some((designation) =>
//         requiredDesignations.includes(designation)
//       );
//       setHasAccess(userHasAccess); // Set access state
//     }
//   }, []);

//   const approveSaving = async (id) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/opensaving/approved/${id}`,
//         { username } // Pass username to the backend
//       );
//       setPendingSavings(pendingSavings.filter((saving) => saving._id !== id));
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error approving center:", error.message);
//       alert("Error approving the saving.");
//     }
//   };

//   const cancelSaving = async (id) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/opensaving/cancel/${id}`
//       );
//       setPendingSavings(pendingSavings.filter((saving) => saving._id !== id));
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error canceling center:", error.message);
//       alert("Error canceling the saving.");
//     }
//   };

//   const reviewSaving = async (id) => {
//     try {
//       // eslint-disable-next-line no-unused-vars
//       const response = await axios.post(
//         `http://localhost:5000/opensaving/review/${id}` // Call the API to update the status to "Needs Correction"
//       );

//       // Remove the center from the list after it's sent for review
//       setPendingSavings(pendingSavings.filter((saving) => saving._id !== id));
//       alert("Center sent back for correction");
//     } catch (error) {
//       console.error("Error reviewing center:", error.message);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const ViewSaving = (saving) => {
//     navigate("/home/SavingAbout", {
//       state: { SavingID: saving._id, from: "ApproveSavings" },
//     });
//   };

//   // Filter logic based on Branches
//   const filteredSavings = Branches.includes("AllBranch")
//     ? pendingSavings
//     : pendingSavings.filter((saving) =>
//         Branches.some((branch) => branch === saving.SavingBranch)
//       );

//   if (!hasAccess) {
//     return (
//       <div className="bg-light container-fluid">
//         <div className="p-2">
//           <div className="border-bottom mb-5">
//             <h2 className="text-center mb-4 pt-3">Approve Saving</h2>
//           </div>
//         </div>
//         <div className="p-3">
//           <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-light container-fluid">
//       <div className="p-2">
//         <div className="border-bottom mb-5">
//           <h2 className="text-center mb-4 pt-3">Approve Saving</h2>
//         </div>
//       </div>

//       <div className="p-3">
//         {error && <div className="alert alert-danger">{error}</div>}

//         {filteredSavings.length > 0 ? (
//           <div className="table-responsive">
//             <table className="table table-bordered table-striped">
//               <thead>
//                 <tr>
//                   <th>Saving ID</th>
//                   <th>Member ID</th>
//                   <th>Member Name</th>
//                   <th>Mobile</th>
//                   <th>Branch</th>
//                   <th>Center</th>
//                   <th>Saving Type</th>
//                   <th>Saving Time</th>
//                   <th>Amount</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredSavings.map((saving, index) => (
//                   <tr key={saving._id || index}>
//                     <td>{saving.SavingID}</td>
//                     <td>{saving.memberID}</td>
//                     <td>{saving.SavingName}</td>
//                     <td>{saving.SavingMobile}</td>
//                     <td>{saving.SavingBranch}</td>
//                     <td>{saving.SavingCenter}</td>
//                     <td>{saving.SavingType}</td>
//                     <td>{saving.SavingTime}</td>
//                     <td>{saving.SavingAmount}</td>
//                     <td>
//                       <button
//                         className="btn btn-success me-2"
//                         onClick={() => approveSaving(saving._id)}
//                       >
//                         <i className="fas fa-check"></i>
//                       </button>
//                       <button
//                         className="btn btn-success me-2"
//                         onClick={() => ViewSaving(saving)}
//                       >
//                         <i className="fas fa-eye"></i>
//                       </button>
//                       <button
//                         className="btn btn-warning  me-2"
//                         onClick={() => reviewSaving(saving._id)}
//                       >
//                         <i className="fas fa-redo"></i>
//                       </button>
//                       <button
//                         className="btn btn-danger"
//                         onClick={() => cancelSaving(saving._id)}
//                       >
//                         <i className="fas fa-times"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-center">No Savings pending approval</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ApproveSavings;
