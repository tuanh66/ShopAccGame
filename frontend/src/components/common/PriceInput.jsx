import React from "react";

const PriceInput = ({
  value,
  onChange,
  name,
  id,
  placeholder,
  className,
  required,
}) => {
  // Format number with dots (e.g., 20000 -> 20.000)
  const formatValue = (val) => {
    if (val === undefined || val === null || val === "") return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e) => {
    // Remove all non-digit characters
    const rawValue = e.target.value.replace(/\D/g, "");

    // Call parent's onChange with a simulated event object
    if (onChange) {
      onChange({
        target: {
          name: name,
          value: rawValue ? Number(rawValue) : "",
        },
      });
    }
  };

  return (
    <input
      type="text"
      id={id}
      name={name}
      placeholder={placeholder}
      className={className}
      value={formatValue(value)}
      onChange={handleChange}
      required={required}
    />
  );
};

export default PriceInput;
