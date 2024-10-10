// // eslint-disable-next-line no-unused-vars
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "../../css/center.css";
// import { useNavigate } from "react-router-dom";

// const ReviewLoan = () => {
//   const [ReviewLoans, setReviewLoans] = useState([]);
//   const [error, setError] = useState("");
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const centersPerPage = 25; // Centers per page
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchReviewCenters = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/openloan/review"
//         );
//         const centers = response.data;

//         const storedUserData = localStorage.getItem("userBranchData");
//         const parsedData = JSON.parse(storedUserData);
//         const currentUsername = parsedData.username;

//         // Filter centers by the current username
//         const filteredCenters = centers.filter(
//           (center) => center.submittedBy === currentUsername
//         );

//         setReviewLoans(filteredCenters);
//       } catch (error) {
//         setError("Error fetching centers needing correction");
//       }
//     };

//     fetchReviewCenters();
//   }, []);

//   const cancelLoans = async (id) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/openloan/cancel/${id}`
//       );
//       setReviewLoans(ReviewLoans.filter((Loan) => Loan._id !== id));
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error canceling center:", error.message);
//       alert("Error canceling the Loans.");
//     }
//   };

//   const EditLoans = (Loans) => {
//     navigate("/home/SavingEdit", { state: { loanID: Loans._id } });
//   };

//   const CheckedLoans = async (id) => {
//     try {
//       const updatedLoans = { approvalStatus: "Pending" }; // or 'Approved' depending on your logic

//       const response = await axios.put(
//         `http://localhost:5000/loan-callback/${id}`,
//         updatedLoans
//       );

//       setReviewLoans((prevState) =>
//         prevState.map((Loan) =>
//           Loan._id === id ? { ...Loan, approvalStatus: "Pending" } : Loan
//         )
//       );

//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error updating Loans:", error.message);
//       alert("Error updating the Loans.");
//     }
//   };

//   // Pagination logic
//   const indexOfLastLoan = currentPage * centersPerPage;
//   const indexOfFirstLoan = indexOfLastLoan - centersPerPage;
//   const currentLoans = ReviewLoans.slice(indexOfFirstLoan, indexOfLastLoan);
//   const totalPages = Math.ceil(ReviewLoans.length / centersPerPage);

//   const paginate = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

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
//               <i className="fas fa-pen"></i> ঋণ পুনঃনিরীক্ষণ{" "}
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
//             <table className="table table-bordered table-striped">
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
//                 {currentLoans.map((Loan, index) => (
//                   <tr key={Loan._id || index}>
//                     <td>{Loan.loanID}</td>
//                     <td>{Loan.memberID}</td>
//                     <td>{Loan.OLname}</td>
//                     <td>{Loan.OLmobile}</td>
//                     <td>{Loan.OLbranch}</td>
//                     <td>{Loan.OLcenter}</td>
//                     <td>{Loan.loanType}</td>
//                     <td>{Loan.OLamount}</td>
//                     <td>
//                       <button
//                         className="btn btn-success me-2"
//                         onClick={() => CheckedLoans(Loan._id)}
//                       >
//                         <i className="fas fa-check"></i>
//                       </button>
//                       <button
//                         className="btn btn-success me-2"
//                         onClick={() => EditLoans(Loan)}
//                       >
//                         <i className="fas fa-edit"></i>
//                       </button>

//                       <button
//                         className="btn btn-danger"
//                         onClick={() => cancelLoans(Loan._id)}
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
//             No loans found for review.
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

// export default ReviewLoan;
