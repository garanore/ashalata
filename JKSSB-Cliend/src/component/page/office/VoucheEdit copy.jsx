// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Importing uuid

const MEMBER_LIST_CENTER_ROUTE = "/home/Voucher";

const ProductTypeNameandCodeDebit = {
  1205: "Interest on Head Office Fund",
  1206: "Interest on BO cum. Profit",
  1207: "Interest on Bank Loan",
  1213: "Interest ",
  1220: " Bank Loan",
};

const ProductTypeNameandCodeCredit = {
  1208: "Loan Loss Provision",
  1209: "Salary & Allowance",
  1210: "National Exchequer",
  1211: "Office Rent",
};

function VoucherEdit() {
  const navigate = useNavigate();
  const [submitMessage, setSubmitMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateWarning, setDateWarning] = useState(false);
  const [debitSections, setDebitSections] = useState([
    {
      key: uuidv4(), // Use uuidv4() to generate a unique key
      selectedProductCode: "",
      productName: "",
      sellCost: "",
      comment: "",
    },
  ]);
  const [creditSections, setCreditSections] = useState([
    {
      key: uuidv4(), // Use uuidv4() to generate a unique key
      selectedProductCode: "",
      productName: "",
      sellCost: "",
      comment: "",
    },
  ]);

  // Function to fetch data by date
  const fetchDataByDate = async (date) => {
    try {
      const response = await fetch(
        `http://localhost:5000/find-data-by-date/${date}`
      );
      const result = await response.json();

      if (response.ok) {
        // Populate sections only if data is available, otherwise set empty sections
        if (result.debitData) {
          populateSections(
            result.debitData,
            setDebitSections,
            ProductTypeNameandCodeDebit
          );
        } else {
          setDebitSections([
            {
              key: uuidv4(),
              selectedProductCode: "",
              productName: "",
              sellCost: "",
              comment: "",
            },
          ]);
        }

        if (result.creditData) {
          populateSections(
            result.creditData,
            setCreditSections,
            ProductTypeNameandCodeCredit
          );
        } else {
          setCreditSections([
            {
              key: uuidv4(),
              selectedProductCode: "",
              productName: "",
              sellCost: "",
              comment: "",
            },
          ]);
        }
      } else {
        console.error(result.message);
        setSubmitMessage(result.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSubmitMessage(`Error: ${error.message}`);
    }
  };

  const populateSections = (data, setSections, productTypeData) => {
    if (!data || data.length === 0) {
      // If there's no data, set the section to a single empty entry
      setSections([
        {
          key: uuidv4(),
          selectedProductCode: "",
          productName: "",
          sellCost: "",
          comment: "",
        },
      ]);
    } else {
      // Map through the data and create sections
      const sections = data.map((item) => ({
        key: uuidv4(),
        selectedProductCode: item.productCode,
        productName: productTypeData[item.productCode] || "",
        sellCost: String(item.sellCost || ""),
        comment: item.comment || "",
      }));
      setSections(sections);
    }
  };

  const handleProductCodeTypeChange =
    (sections, setSections, productTypeData) => (index, event) => {
      const selectedKey = event.target.value;
      const updatedSections = sections.map((section, idx) =>
        idx === index
          ? {
              ...section,
              selectedProductCode: selectedKey,
              productName: productTypeData[selectedKey] || "",
            }
          : section
      );
      setSections(updatedSections);
    };

  const handleInputChange =
    (sections, setSections, field) => (index, event) => {
      const value = event.target.value;
      const updatedSections = sections.map((section, idx) =>
        idx === index ? { ...section, [field]: String(value) } : section
      );
      setSections(updatedSections);
    };

  const addSection = (sections, setSections) => {
    setSections([
      ...sections,
      {
        key: uuidv4(), // Use uuidv4() to generate a unique key
        selectedProductCode: "",
        productName: "",
        sellCost: "",
        comment: "",
      },
    ]);
  };

  const removeSection = (sections, setSections) => (index) => {
    const updatedSections = sections.filter((_, idx) => idx !== index);
    setSections(updatedSections);
  };

  const renderSections = (sections, setSections, productTypeData) => {
    return sections.map((section, index) => (
      <div className="mb-5 row" key={section.key}>
        <div className="col-2">
          <label htmlFor={`ProductCode-${section.key}`} className="form-label">
            ID
          </label>
          <select
            id={`ProductCode-${section.key}`}
            className="form-select"
            value={section.selectedProductCode}
            onChange={(event) =>
              handleProductCodeTypeChange(
                sections,
                setSections,
                productTypeData
              )(index, event)
            }
          >
            <option value="">বাছাই করুণ</option>
            {Object.keys(productTypeData).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div className="col-3">
          <label htmlFor={`ProductName-${section.key}`} className="form-label">
            Name
          </label>
          <input
            id={`ProductName-${section.key}`}
            className="form-control"
            type="text"
            value={section.productName}
            readOnly
          />
        </div>
        <div className="col-2">
          <label
            htmlFor={`ProductSellCost-${section.key}`}
            className="form-label"
          >
            Amount
          </label>
          <input
            id={`ProductSellCost-${section.key}`}
            className="form-control"
            type="text"
            value={section.sellCost}
            onChange={(event) =>
              handleInputChange(sections, setSections, "sellCost")(index, event)
            }
          />
        </div>
        <div className="col-4">
          <label
            htmlFor={`CommentForProduct-${section.key}`}
            className="form-label"
          >
            Comment
          </label>
          <input
            id={`CommentForProduct-${section.key}`}
            className="form-control"
            type="text"
            value={section.comment}
            onChange={(event) =>
              handleInputChange(sections, setSections, "comment")(index, event)
            }
          />
        </div>
        <div className="col-1 mt-4">
          {sections.length > 1 && index < sections.length - 1 && (
            <button
              type="button"
              className="btn btn-danger mb-3"
              onClick={() => removeSection(sections, setSections)(index)}
            >
              X
            </button>
          )}
          {index === sections.length - 1 && (
            <button
              type="button"
              className="btn btn-primary mb-3"
              onClick={() => addSection(sections, setSections)}
            >
              +
            </button>
          )}
        </div>
      </div>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      setDateWarning(true);
      return;
    }

    setDateWarning(false);

    // Format the date to match the database format
    const localDate = new Date(
      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
    );
    const formattedDate = localDate.toISOString().split("T")[0];

    const isSellCostValid = (section) =>
      String(section.sellCost || "").trim() !== "";

    const sectionsToSave = (sections) =>
      sections.filter((section) => isSellCostValid(section));

    const emptySellCostSections = debitSections
      .concat(creditSections)
      .filter((section) => !isSellCostValid(section));

    if (emptySellCostSections.length > 0) {
      const userConfirmed = window.confirm(
        "Some sections have empty Amount values. Do you want to proceed and save the non-empty sections?"
      );

      if (!userConfirmed) {
        return;
      }
    }

    try {
      for (const section of sectionsToSave(debitSections)) {
        await fetch("http://localhost:5000/update-data", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productCode: section.selectedProductCode,
            sellCost: section.sellCost,
            comment: section.comment,
            date: formattedDate,
          }),
        });
      }

      for (const section of sectionsToSave(creditSections)) {
        await fetch("http://localhost:5000/update-data", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productCode: section.selectedProductCode,
            sellCost: section.sellCost,
            comment: section.comment,
            date: formattedDate,
          }),
        });
      }

      setSubmitMessage("Data updated successfully");
    } catch (error) {
      console.error("Error updating data:", error);
      setSubmitMessage(`Error: ${error.message}`);
    }
  };

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      fetchDataByDate(formattedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <div className="bg-light mt-2">
      <div className="mt-2 p-2">
        <form onSubmit={handleSubmit}>
          <div className="border-bottom mb-3">
            <h2 className="text-center mb-4 pt-3">Edit Voucher</h2>
          </div>

          <div className="mb-3 col-3">
            <label htmlFor="date" className="form-label">
              তারিখ নির্বাচন করুণ
            </label>
            <div>
              <DatePicker
                id="date"
                className="form-control"
                dateFormat="dd/MM/yyyy"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
              {dateWarning && (
                <div className="text-danger mt-2">Please select a date.</div>
              )}
            </div>
          </div>

          <div className="border-bottom mb-3">
            <h2 className="text-center mb-4 pt-3">Debit</h2>
          </div>
          {renderSections(
            debitSections,
            setDebitSections,
            ProductTypeNameandCodeDebit
          )}
          <div className="border-bottom mb-3">
            <h2 className="text-center mb-4 pt-3">Credit</h2>
          </div>
          {renderSections(
            creditSections,
            setCreditSections,
            ProductTypeNameandCodeCredit
          )}
          <div className="d-flex justify-content-between mt-5">
            <button className="btn btn-primary">Update</button>
            <button
              type="button"
              onClick={handleCancel}
              className=" btn btn-primary btn-md"
            >
              Cancel
            </button>
          </div>

          {submitMessage && (
            <div
              className={`alert ${
                submitMessage.includes("Error")
                  ? "alert-danger"
                  : "alert-success"
              } mt-3`}
              role="alert"
            >
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default VoucherEdit;
