import React from "react";

interface SelectionCardProps {
  icon: React.ReactNode;
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: "dark" | "light";
  hideLabel?: boolean;
  appearance?: "card" | "bare" | "group";
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

  // Group appearance: circular icon wrapper, responsive sizes
  if (appearance === "group") {
    const boxSize = "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28";
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center justify-center p-0 focus:outline-none transition-all`}
        aria-pressed={isSelected}
      >
        <div
          className={`${boxSize} flex items-center justify-center transition-colors ${isSelected ? "border-2 border-[#ffe000]" : "border border-transparent"}`}
        >
          <div className="w-11/12 h-11/12 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex flex-col items-center justify-center ${appearance === "bare" ? "p-0" : "p-4"} ${appearance === "bare" ? "rounded-none" : "rounded-2xl"} ${base} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffe000] transition-colors`}
      aria-pressed={isSelected}
    >
      <div
        className={`${appearance === "bare" ? "mb-0" : "h-12 mb-2"} flex items-center justify-center ${isLight ? "text-[#003366]" : "text-white"} transition-transform`}
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
