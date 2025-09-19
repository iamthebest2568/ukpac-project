import React from "react";

interface ColorPaletteProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  selectedColor,
  onColorSelect,
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-6 sm:grid-cols-6 md:grid-cols-6 gap-3">
        {colors.map((c) => {
          const isSelected =
            c.toLowerCase() === (selectedColor || "").toLowerCase();
          const isImage = c.startsWith("http");
          return (
            <button
              key={c}
              type="button"
              onClick={() => onColorSelect(c)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onColorSelect(c);
                }
              }}
              aria-pressed={isSelected}
              className={`relative w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white shadow-sm hover:shadow-md transition-shadow ${isSelected ? "ring-4 ring-[#ffd874]" : "ring-1 ring-[#e5e7eb]"}`}
            >
              {isImage ? (
                (() => {
                  const srcSet = c.includes("width=")
                    ? `${c} 1x, ${c.replace(/width=\\d+/, "width=1600")} 2x`
                    : undefined;
                  return (
                    <img
                      src={c}
                      srcSet={srcSet}
                      alt="color swatch"
                      className="w-full h-full object-contain select-none"
                      decoding="async"
                      loading="eager"
                      draggable={false}
                      style={{ imageRendering: "auto" }}
                    />
                  );
                })()
              ) : (
                <span
                  className="w-full h-full block"
                  style={{ background: c }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPalette;
