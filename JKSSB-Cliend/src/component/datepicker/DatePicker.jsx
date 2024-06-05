// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";

const DatePickers = ({ selectedDate, onDateChange }) => {
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    // Parse the selected date and format it to "yyyy-MM-dd"
    const parsedDate = new Date(selectedDate);
    const formattedDate = `${parsedDate.getFullYear()}-${String(
      parsedDate.getMonth() + 1
    ).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`;
    onDateChange(formattedDate);
  };

  return (
    <div className="mb-3">
      <label htmlFor="dob" className="form-label">
        জম্ম তারিখ
      </label>
      <input
        type="date"
        className="form-control"
        id="dob"
        value={selectedDate}
        onChange={handleDateChange}
        required
      />
    </div>
  );
};

DatePickers.propTypes = {
  selectedDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
};

export default DatePickers;
