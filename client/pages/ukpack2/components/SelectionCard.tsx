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
  // Base styles for non-selected state
  const baseNonSelected = appearance === "bare"
    ? `${isLight ? "text-[#003366]" : "text-white"} bg-transparent border-0`
    : isLight
      ? "bg-white text-[#003366] border border-gray-400"
      : "bg-transparent text-white border border-[#081042]";
  // When selected, keep the same visual but increase emphasis (no yellow)
  const base = isSelected ? `${baseNonSelected} font-semibold` : baseNonSelected;

  // Normalize icon sizes: ensure icons (img/svg) scale to the container height
  let normalizedIcon = icon;
  try {
    if (React.isValidElement(icon)) {
      const originalProps: any = (icon as React.ReactElement).props || {};
      const mergedStyle = { ...(originalProps.style || {}), height: "100%", width: "100%" };
      // ensure icons fill the available box while maintaining aspect ratio
      const mergedClassName = `${originalProps.className || ""} h-full w-full object-contain`.trim();
      normalizedIcon = React.cloneElement(icon as React.ReactElement, { ...originalProps, style: mergedStyle, className: mergedClassName });
    }
  } catch (e) {
    normalizedIcon = icon;
  }

  // Group appearance: icon-only (no background circle or shadow)
  if (appearance === "group") {
    // Fixed icon container to control size while keeping no decorative background
    const boxSize = "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28";

    return (
      <button
        type="button"
        onClick={onClick}
        onFocus={(e) => e.currentTarget.blur()}
        style={{ outline: 'none', boxShadow: 'none' }}
        className={`inline-flex items-center justify-center p-0 ${layout === 'horizontal' ? 'horizontal' : 'vertical'}`}
        aria-pressed={isSelected}
      >
        <div className={`${boxSize} flex items-center justify-center border border-transparent bg-transparent`}>
          <div className="w-full h-full flex items-center justify-center">
            {normalizedIcon}
          </div>
        </div>
      </button>
    );
  }

  // size adjustments
  const FIXED_ICON_HEIGHT_CLASS = "h-16 md:h-20"; // fallback Tailwind classes
  const iconContainerClass = `${appearance === "bare" ? "mb-0" : "mb-2 p-2"}`;
  const labelClass =
    size === "lg"
      ? "px-2 text-sm md:text-base"
      : size === "sm"
      ? "px-2 text-xs md:text-sm"
      : "px-2 text-xs md:text-sm";

  // Build button classes and append helpers for CSS targeting
  const appearanceClasses = appearance === "bare" ? "w-auto p-0 rounded-none" : "w-full p-3 rounded-2xl";
  const focusClasses = "focus:outline-none";
  const layoutClass = layout === "horizontal" ? "horizontal" : "vertical";

  if (layout === "horizontal") {
    const iconBox = `flex-shrink-0 ${FIXED_ICON_HEIGHT_CLASS} w-auto flex items-center justify-center`;
    return (
      <button
        type="button"
        onClick={onClick}
        onFocus={(e) => e.currentTarget.blur()}
        style={{ outline: 'none', boxShadow: 'none' }}
        className={`${appearanceClasses} ${base} ${focusClasses} ${layoutClass}`}
        aria-pressed={isSelected}
      >
        <div className={`iconContainer ${iconBox} flex items-center justify-center ${isLight ? "text-[#003366]" : "text-white"}`}>
          {normalizedIcon}
        </div>
        {!hideLabel && (
          <div className={`ml-3 ${labelClass} font-sarabun text-left leading-tight break-words whitespace-normal max-w-full`}>
            {label}
          </div>
        )}
      </button>
    );
  }

  // Vertical layout (default)
  return (
    <button
      type="button"
      onClick={onClick}
      onFocus={(e) => e.currentTarget.blur()}
      style={{ outline: 'none', boxShadow: 'none' }}
      className={`${appearance === "bare" ? "w-auto p-0" : "w-full p-4"} ${appearance === "bare" ? "rounded-none" : "rounded-2xl"} ${base} ${focusClasses} ${layoutClass}`}
      aria-pressed={isSelected}
    >
      <div className={`${iconContainerClass} ${FIXED_ICON_HEIGHT_CLASS} flex items-center justify-center ${isLight ? "text-[#003366]" : "text-white"} transition-transform iconContainer`}>
        {normalizedIcon}
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
