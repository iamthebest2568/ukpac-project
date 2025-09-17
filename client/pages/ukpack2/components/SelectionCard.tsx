import React from "react";

interface SelectionCardProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: "dark" | "light";
  hideLabel?: boolean;
  appearance?: "card" | "bare" | "group";
  size?: "sm" | "md" | "lg";
  layout?: "vertical" | "horizontal";
}

const SelectionCard: React.FC<SelectionCardProps> = ({
  icon,
  label,
  isSelected = false,
  onClick,
  variant = "dark",
  hideLabel = false,
  appearance = "card",
  size = "md",
  layout = "vertical",
}) => {
  const isLight = variant === "light";
  const base =
    appearance === "bare"
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

  // size adjustments
  const baseHeight = size === "lg" ? "h-20" : size === "sm" ? "h-8" : "h-12";
  const iconContainerClass = `${baseHeight} ${appearance === "bare" ? "mb-0" : "mb-2"}`;
  const labelClass = size === "lg" ? "px-2 text-sm md:text-base" : size === "sm" ? "px-2 text-xs md:text-sm" : "px-2 text-xs md:text-sm";

  // Horizontal layout
  if (layout === "horizontal") {
    const iconBox = size === "lg" ? "w-28 h-20" : size === "sm" ? "w-16 h-10" : "w-20 h-12";
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center ${appearance === "bare" ? "p-0" : "p-3"} ${appearance === "bare" ? "rounded-none" : "rounded-2xl"} ${base} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffe000] transition-colors`}
        aria-pressed={isSelected}
      >
        <div className={`${iconBox} flex items-center justify-center flex-shrink-0 ${isLight ? "text-[#003366]" : "text-white"}`}>
          {icon}
        </div>
        {!hideLabel && (
          <div className={`ml-3 ${labelClass} font-sarabun text-left leading-tight break-words whitespace-normal max-w-full`}>
            {label}
          </div>
        )}
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
        className={`${iconContainerClass} flex items-center justify-center ${isLight ? "text-[#003366]" : "text-white"} transition-transform`}
      >
        {icon}
      </div>
      {!hideLabel && (
        <div className={`${labelClass} font-sarabun text-center leading-tight break-words whitespace-normal max-w-full selection-label-mobile`}>
          {label}
        </div>
      )}
    </button>
  );
};

export default SelectionCard;
