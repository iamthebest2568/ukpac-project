import React, { useState } from "react";

type Props = {
  id?: string;
  value: number | "";
  onChange: (v: number | "") => void;
  min?: number;
  max?: number;
  className?: string;
};

const NumericPlaceholderInput: React.FC<Props> = ({ id, value, onChange, min = 0, max = Infinity, className = "" }) => {
  const [focused, setFocused] = useState(false);

  const displayValue = value === "" ? "00" : String(value).padStart(2, "0");
  const inputValue = focused ? (value === "" ? "" : String(value)) : displayValue;

  return (
    <input
      id={id}
      type="number"
      value={inputValue}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={(e) => {
        setFocused(false);
        if (e.currentTarget.value === "") onChange("");
      }}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") {
          onChange("");
          return;
        }
        const parsed = Math.max(min, Math.min(max, parseInt(raw || "0", 10)));
        onChange(parsed);
      }}
      className={className}
      min={min}
      max={Number.isFinite(max) ? max : undefined}
    />
  );
};

export default NumericPlaceholderInput;
