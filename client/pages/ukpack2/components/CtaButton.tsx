import React from "react";

interface CtaButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const CtaButton: React.FC<CtaButtonProps> = ({
  text,
  onClick,
  className = "",
  style,
}) => {
  const baseStyle: React.CSSProperties = {
    paddingLeft: "calc(1.5rem + 7.5px)",
    paddingRight: "calc(1.5rem + 7.5px)",
    minWidth: "220px",
    boxSizing: "border-box",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-[#ffe000] text-black rounded-full py-2 inline-flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000d59] hover:bg-[#000d59] hover:text-white transition-colors font-prompt font-semibold ${className}`}
      style={{ ...baseStyle, ...(style || {}) }}
    >
      {text}
    </button>
  );
};

export default CtaButton;
