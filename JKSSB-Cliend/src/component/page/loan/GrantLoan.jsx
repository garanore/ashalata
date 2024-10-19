// // eslint-disable-next-line no-unused-vars
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "../../css/center.css";
// import { useNavigate } from "react-router-dom";

// const GrantLoan = () => {
//   const [pendingLoans, setPendingLoans] = useState([]);
//   const [error, setError] = useState("");
//   const [Branches, setBranches] = useState([]);
//   const [hasAccess, setHasAccess] = useState(false);
//   const [username, setUsername] = useState(""); // Add username state
//   const navigate = useNavigate();
//   const [accountName, setAccountName] = useState(""); // Add accountName state
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const centersPerPage = 25; // Centers per page

//   useEffect(() => {
//     const fetchPendingSavins = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/openloan/grant"
//         );
//         setPendingLoans(response.data);
//       } catch (error) {
//         setError("Error fetching pending Loans");
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

//       const usernames = Object.keys(parsedData)
//         .filter((key) => key.startsWith("username"))
//         .map((key) => parsedData[key]);

//       const username = usernames[0] || "Unknown";
//       setUsername(username);

//       // Fetch accountName based on the username
//       if (username !== "Unknown") {
//         axios
//           .get(`http://localhost:5000/get-user-username/${username}`)
//           .then((response) => {
//             if (response.data.length > 0) {
//               setAccountName(response.data[0].accountName);
//             } else {
//               setAccountName("Unknown User");
//             }
//           })
//           .catch(() => {
//             setAccountName("Error fetching user");
//           });
//       }

//       // Check if the user has one of the required designations
//       const requiredDesignations = [
//         "শাখা ব্যাবস্থাপক",
//         "সহকারী শাখা ব্যাবস্থাপক",
//       ];
//       const userHasAccess = designations.some((designation) =>
//         requiredDesignations.includes(designation)
//       );
//       setHasAccess(userHasAccess); // Set access state
//     }
//   }, []);

//   const approveLoans = async (id) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/openloan/grant/${id}`,
//         { username } // Pass username to the backend
//       );
//       setPendingLoans(pendingLoans.filter((Loans) => Loans._id !== id));
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error approving center:", error.message);
//       alert("Error approving the Loans.");
//     }
//   };

//   const cancelLoans = async (id) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/openloan/cancel/${id}`
//       );
//       setPendingLoans(pendingLoans.filter((Loans) => Loans._id !== id));
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error canceling center:", error.message);
//       alert("Error canceling the Loans.");
//     }
//   };

//   const reviewLoans = async (id) => {
//     try {
//       // eslint-disable-next-line no-unused-vars
//       const response = await axios.post(
//         `http://localhost:5000/openloan/review/${id}` // Call the API to update the status to "Needs Correction"
//       );

//       // Remove the center from the list after it's sent for review
//       setPendingLoans(pendingLoans.filter((Loans) => Loans._id !== id));
//       alert("Center sent back for correction");
//     } catch (error) {
//       console.error("Error reviewing center:", error.message);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const ViewLoans = (Loans) => {
//     navigate("/home/SavingAbout", {
//       state: { loanID: Loans._id, from: "ApproveLoans" },
//     });
//   };

//   // Filter logic based on Branches
//   const filteredLoans = Branches.includes("AllBranch")
//     ? pendingLoans
//     : pendingLoans.filter((Loans) =>
//         Branches.some((branch) => branch === Loans.OLbranch)
//       );

//   // Pagination logic
//   const indexOfLastLoan = currentPage * centersPerPage;
//   const indexOfFirstLoan = indexOfLastLoan - centersPerPage;
//   const currentLoans = filteredLoans.slice(indexOfFirstLoan, indexOfLastLoan);
//   const totalPages = Math.ceil(filteredLoans.length / centersPerPage);

//   const paginate = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   if (!hasAccess) {
//     return (
//       <div className="bg-light container-fluid">
//         <div className="p-4">
//           <div className="border-bottom mb-4">
//             <h2
//               className="text-center mb-4"
//               style={{ fontWeight: "bold", color: "#2D3748" }}
//             >
//               <i className="fas fa-lock" style={{ marginRight: "10px" }}></i>
//               ঋণের অনুমতি
//             </h2>
//           </div>
//           <div
//             className="d-flex justify-content-center align-items-center"
//             style={{
//               backgroundColor: "#f8d7da",
//               borderRadius: "10px",
//               padding: "20px",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <p
//               className="text-center mb-0"
//               style={{
//                 fontSize: "1.25rem",
//                 fontWeight: "bold",
//                 color: "#721c24",
//               }}
//             >
//               <i
//                 className="fas fa-exclamation-triangle"
//                 style={{ fontSize: "1.5rem", marginRight: "10px" }}
//               ></i>
//               প্রিয়{" "}
//               <span className="highlighted-username">
//                 {accountName || username}
//               </span>
//               , এই পেইজে আপনার অনুমতি নেই।
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-light container-fluid">
//       <div className="row mb-4">
//         <div className="col">
//           <div
//             className="d-flex justify-content-center align-items-center"
//             style={{
//               backgroundColor: "#f0f4f8", // Soft background for the header
//               borderRadius: "10px", // Rounded edges for a modern look
//               padding: "20px",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
//             }}
//           >
//             <h2
//               className="text-center mb-0"
//               style={{
//                 fontWeight: "bold",
//                 color: "#2D3748",
//                 fontSize: "2rem", // Larger text for prominence
//               }}
//             >
//               <i className="fas fa-money-bill-wave"></i> ঋণের অনুমতি
//             </h2>
//           </div>
//         </div>
//       </div>
//       <div className="row">
//         <div className="col">
//           <hr
//             style={{
//               border: "none",
//               borderTop: "2px solid #2D3748", // Thicker line for emphasis
//               marginTop: "10px",
//             }}
//           />
//         </div>
//       </div>

//       <div className="p-3">
//         {error && <div className="alert alert-danger">{error}</div>}

//         {currentLoans.length > 0 ? (
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="table-light">
//                 <tr>
//                   <th>Loan ID</th>
//                   <th>Member ID</th>
//                   <th>Member Name</th>
//                   <th>Mobile</th>
//                   <th>Branch</th>
//                   <th>Center</th>
//                   <th>Loan Type</th>
//                   <th>Amount</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentLoans.map((loan, index) => (
//                   <tr key={loan._id || index}>
//                     <td>{loan.loanID}</td>
//                     <td>{loan.memberID}</td>
//                     <td>{loan.OLname}</td>
//                     <td>{loan.OLmobile}</td>
//                     <td>{loan.OLbranch}</td>
//                     <td>{loan.OLcenter}</td>
//                     <td>{loan.loanType}</td>
//                     <td>{loan.OLamount}</td>
//                     <td>
//                       <button
//                         className="btn btn-success me-2"
//                         onClick={() => approveLoans(loan._id)}
//                       >
//                         <i className="fas fa-check"></i>
//                       </button>
//                       <button
//                         className="btn btn-success me-2"
//                         onClick={() => ViewLoans(loan)}
//                       >
//                         <i className="fas fa-eye"></i>
//                       </button>
//                       <button
//                         className="btn btn-warning  me-2"
//                         onClick={() => reviewLoans(loan._id)}
//                       >
//                         <i className="fas fa-redo"></i>
//                       </button>
//                       <button
//                         className="btn btn-danger"
//                         onClick={() => cancelLoans(loan._id)}
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
//           <div className="alert alert-warning text-center" role="alert">
//             <i className="fas fa-exclamation-triangle me-2"></i>{" "}
//             {/* Font Awesome warning icon */}
//             অনুমতির জন্য কোন ঋণ নেই।
//           </div>
//         )}
//       </div>

//       <div className="row justify-content-center my-3">
//         <div className="col-md-12">
//           <nav>
//             <ul className="pagination pagination-rounded">
//               <li className="page-item">
//                 <button
//                   onClick={() => paginate(currentPage - 1)}
//                   className={`page-link ${currentPage === 1 ? "disabled" : ""}`}
//                   disabled={currentPage === 1} // Disable if on the first page
//                   title="Previous Page"
//                 >
//                   <i className="fas fa-chevron-left"></i>{" "}
//                   {/* Left arrow icon */}
//                   Previous
//                 </button>
//               </li>
//               {[...Array(totalPages)].map((_, i) => (
//                 <li
//                   key={i + 1}
//                   className={`page-item ${
//                     i + 1 === currentPage ? "active" : ""
//                   }`}
//                 >
//                   <button
//                     onClick={() => paginate(i + 1)}
//                     className="page-link"
//                     title={`Go to page ${i + 1}`}
//                   >
//                     {i + 1}
//                   </button>
//                 </li>
//               ))}
//               <li className="page-item">
//                 <button
//                   onClick={() => paginate(currentPage + 1)}
//                   className={`page-link ${
//                     currentPage === totalPages ? "disabled" : ""
//                   }`}
//                   disabled={currentPage === totalPages} // Disable if on the last page
//                   title="Next Page"
//                 >
//                   Next
//                   <i className="fas fa-chevron-right"></i>{" "}
//                   {/* Right arrow icon */}
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GrantLoan;
