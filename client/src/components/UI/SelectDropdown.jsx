import React from "react";
import { Select } from "antd";

const { Option } = Select;

const Selectdropdown = ({ options, placeholder, onChange, mode = "multiple", style }) => {
  return (
    <>
      <Select
        mode={mode}
        style={{
          width: "22%",
          ...style
        }}
        placeholder={placeholder}
        onChange={onChange}
      >
        {options.map((option) => (
          <Option
            className="option-item"
            key={option.value}
            value={option.value}
            label={option.value}
            style={{ color: 'orangered', padding: '10px' }}
          >
            {option.label}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default Selectdropdown;