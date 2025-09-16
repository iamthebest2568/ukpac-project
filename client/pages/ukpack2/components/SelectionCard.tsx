import React from "react";

interface SelectionCardProps {
  icon: React.ReactNode;
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: "dark" | "light";
  hideLabel?: boolean;
  appearance?: "card" | "bare";
}

const SelectionCard: React.FC<SelectionCardProps> = ({
  icon,
  label,
  isSelected = false,
  onClick,
  variant = "dark",
  hideLabel = false,
  appearance = "card",
}) => {
  const isLight = variant === "light";
  const base = appearance === "bare"
    ? `${isLight ? "text-[#003366]" : "text-white"} bg-transparent border-0`
    : isSelected
      ? isLight
        ? "bg-[#ffe000] text-[#003366] border-transparent font-semibold"
        : "bg-[#ffe000] text-black border-transparent"
      : isLight
        ? "bg-white text-[#003366] border border-gray-400"
        : "bg-transparent text-white border border-[#081042]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex flex-col items-center justify-center ${appearance === "bare" ? "p-0" : "p-4"} ${appearance === "bare" ? "rounded-none" : "rounded-2xl"} ${base} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffe000] transition-colors`}
      aria-pressed={isSelected}
    >
      <div
        className={`${appearance === "bare" ? "mb-0" : "h-12 mb-2"} flex items-center justify-center ${isLight ? "text-[#003366]" : "text-white"}`}
      >
        {icon}
      </div>
      {!hideLabel && (
        <div className="px-2 text-xs md:text-sm font-sarabun text-center leading-tight break-words whitespace-normal max-w-full">
          {label}
        </div>
      )}
    </button>
  );
};

export default SelectionCard;
