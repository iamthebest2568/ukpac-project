import React from 'react';

interface ColorPaletteProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, selectedColor, onColorSelect }) => {
  return (
    <div className="grid grid-cols-6 gap-3">
      {colors.map((c) => {
        const isSelected = c.toLowerCase() === (selectedColor || '').toLowerCase();
        return (
          <button
            key={c}
            type="button"
            onClick={() => onColorSelect(c)}
            aria-pressed={isSelected}
            className={`w-12 h-12 rounded-md focus:outline-none ${isSelected ? 'ring-2 ring-white' : ''}`}
            style={{ backgroundColor: c }}
            title={c}
          />
        );
      })}
    </div>
  );
};

export default ColorPalette;
