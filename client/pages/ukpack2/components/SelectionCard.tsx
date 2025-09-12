import React from 'react';

interface SelectionCardProps {
  icon: React.ReactNode;
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ icon, label, isSelected = false, onClick }) => {
  const base = isSelected
    ? 'bg-[#ffe000] text-black border-transparent'
    : 'bg-transparent text-white border border-[#081042]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-lg ${base} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffe000] transition-colors`}
      aria-pressed={isSelected}
    >
      <div className={`w-12 h-12 mb-2 flex items-center justify-center ${isSelected ? 'text-black' : 'text-white'}`}>
        {icon}
      </div>
      <div className="text-sm font-sarabun">{label}</div>
    </button>
  );
};

export default SelectionCard;
