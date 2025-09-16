import React from "react";

interface SelectionCardProps {
  icon: React.ReactNode;
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: "dark" | "light";
}

const SelectionCard: React.FC<SelectionCardProps> = ({
  icon,
  label,
  isSelected = false,
  onClick,
  variant = "dark",
}) => {
  const base = isSelected
    ? variant === "light"
      ? "bg-[#ffe000] text-[#003366] border-transparent font-semibold"
      : "bg-[#ffe000] text-black border-transparent"
    : variant === "light"
      ? "bg-white text-[#003366] border border-gray-400"
      : "bg-transparent text-white border border-[#081042]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex flex-col items-center justify-center p-4 rounded-2xl ${base} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffe000] transition-colors`}
      aria-pressed={isSelected}
    >
      <div
        className={`h-12 mb-2 flex items-center justify-center ${isSelected ? (variant === "light" ? "text-[#003366]" : "text-black") : variant === "light" ? "text-[#003366]" : "text-white"}`}
      >
        {icon}
      </div>
      <div className="px-2 text-xs md:text-sm font-sarabun text-center leading-tight break-words whitespace-normal max-w-full">
        {label}
      </div>
    </button>
  );
};

export default SelectionCard;
