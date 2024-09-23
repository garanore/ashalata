// // eslint-disable-next-line no-unused-vars
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// const ApproveCenter = () => {
//   const [pendingCenters, setPendingCenters] = useState([]);
//   const [error, setError] = useState("");
//   const [userBranches, setUserBranches] = useState([]);
//   const [, setUserDesignations] = useState([]);
//   const [hasAccess, setHasAccess] = useState(false);

//   useEffect(() => {
//     const fetchPendingCenters = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/opencenter/pending"
//         );
//         setPendingCenters(response.data);
//       } catch (error) {
//         setError("Error fetching pending centers");
//       }
//     };

//     fetchPendingCenters();

//     // Retrieve user data from localStorage
//     const storedUserData = localStorage.getItem("userBranchData");
//     if (storedUserData) {
//       const parsedData = JSON.parse(storedUserData);

//       const branches = Object.keys(parsedData)
//         .filter((key) => key.startsWith("UserBranch"))
//         .map((key) => parsedData[key]);
//       setUserBranches(branches);

//       const designations = Object.keys(parsedData)
//         .filter((key) => key.startsWith("designation"))
//         .map((key) => parsedData[key]);
//       setUserDesignations(designations);

//       // Check if the user has the required designation
//       const requiredDesignations = ["শাখা হিসাব রক্ষক ", "অডিট অফিসার "];
//       const userHasAccess = designations.some((designation) =>
//         requiredDesignations.includes(designation)
//       );
//       setHasAccess(userHasAccess);
//     }
//   }, []);

//   const approveCenter = async (id) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/opencenter/approve/${id}`
//       );
//       setPendingCenters(pendingCenters.filter((center) => center._id !== id));
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error approving center:", error.message);
//     }
//   };

//   const cancelCenter = async (id) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/opencenter/cancel/${id}`
//       );
//       setPendingCenters(pendingCenters.filter((center) => center._id !== id));
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error canceling center:", error.message);
//     }
//   };

//   // Filter logic based on userBranches
//   const filteredCenters = userBranches.includes("AllBranch")
//     ? pendingCenters // Show all centers if user has access to "AllBranch"
//     : pendingCenters.filter((center) =>
//         userBranches.some((branch) => branch === center.centerBranch)
//       ); // Show centers matching any of the user's branches

//   if (!hasAccess) {
//     return (
//       <div className="bg-light container-fluid">
//         <div className="p-2">
//           <div className="border-bottom mb-5">
//             <h2 className="text-center mb-4 pt-3">Approve Centers</h2>
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
//           <h2 className="text-center mb-4 pt-3">Approve Centers</h2>
//         </div>
//       </div>

//       <div className="p-3">
//         {error && <div className="alert alert-danger">{error}</div>}

//         {filteredCenters.length > 0 ? (
//           <div className="table-responsive">
//             <table className="table table-bordered table-striped">
//               <thead>
//                 <tr>
//                   <th>Center ID</th>
//                   <th>Center Name</th>
//                   <th>Branch</th>
//                   <th>Address</th>
//                   <th>Mobile</th>
//                   <th>Worker</th>
//                   <th>Day</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCenters.map((center) => (
//                   <tr key={center._id}>
//                     <td>{center.centerID}</td>
//                     <td>{center.CenterName}</td>
//                     <td>{center.centerBranch}</td>
//                     <td>{center.CenterAddress}</td>
//                     <td>{center.CenterMnumber}</td>
//                     <td>{center.centerWorker}</td>
//                     <td>{center.CenterDay}</td>
//                     <td>
//                       <button
//                         className="btn btn-success me-2"
//                         onClick={() => approveCenter(center._id)}
//                       >
//                         <i className="fas fa-check"></i>
//                       </button>
//                       <button
//                         className="btn btn-danger"
//                         onClick={() => cancelCenter(center._id)}
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
//           <p className="text-center">No centers pending approval</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ApproveCenter;
