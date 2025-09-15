import React from "react";

interface ColorPaletteProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
}

const SWATCH_SIZE = 48; // px
const GAP = 12; // px
const COLS = 6;

const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  selectedColor,
  onColorSelect,
}) => {
  const rows = Math.ceil(colors.length / COLS);
  const width = COLS * SWATCH_SIZE + (COLS - 1) * GAP;
  const height = rows * SWATCH_SIZE + (rows - 1) * GAP;

  const handleKey = (e: React.KeyboardEvent, color: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onColorSelect(color);
    }
  };

  return (
    <div className="overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="list"
        aria-label="Color palette"
        style={{ width: '100%', maxWidth: `${width}px`, height: 'auto', display: 'block' }}
      >
        {colors.map((c, idx) => {
          const col = idx % COLS;
          const row = Math.floor(idx / COLS);
          const x = col * (SWATCH_SIZE + GAP);
          const y = row * (SWATCH_SIZE + GAP);
          const isSelected =
            c.toLowerCase() === (selectedColor || "").toLowerCase();
          return (
            <g key={c} transform={`translate(${x}, ${y})`}>
              {c.startsWith("http") ? (
                <>
                  <image
                    href={c}
                    x={0}
                    y={0}
                    width={SWATCH_SIZE}
                    height={SWATCH_SIZE}
                    preserveAspectRatio="xMidYMid slice"
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => onColorSelect(c)}
                    onKeyDown={(e) => handleKey(e, c)}
                  />
                  {isSelected && (
                    <rect
                      x={-4}
                      y={-4}
                      width={SWATCH_SIZE + 8}
                      height={SWATCH_SIZE + 8}
                      rx={14}
                      ry={14}
                      fill="none"
                      stroke="#ffd874"
                      strokeWidth={3}
                      pointerEvents="none"
                    />
                  )}
                </>
              ) : (
                <>
                  <rect
                    x={0}
                    y={0}
                    width={SWATCH_SIZE}
                    height={SWATCH_SIZE}
                    rx={12}
                    ry={12}
                    fill={c}
                    stroke={isSelected ? "#ffffff" : "rgba(0,0,0,0.08)"}
                    strokeWidth={isSelected ? 3 : 1}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => onColorSelect(c)}
                    onKeyDown={(e) => handleKey(e, c)}
                  />
                  {isSelected && (
                    <rect
                      x={-4}
                      y={-4}
                      width={SWATCH_SIZE + 8}
                      height={SWATCH_SIZE + 8}
                      rx={14}
                      ry={14}
                      fill="none"
                      stroke="#ffd874"
                      strokeWidth={3}
                      pointerEvents="none"
                    />
                  )}
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ColorPalette;
