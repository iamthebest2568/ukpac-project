import React from 'react';

interface SecondaryButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ text, onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        `bg-[#000d59] text-white border border-white rounded-full px-5 py-2 inline-flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000d59] font-prompt font-semibold ${className}`
      }
    >
      {text}
    </button>
  );
};

export default SecondaryButton;
