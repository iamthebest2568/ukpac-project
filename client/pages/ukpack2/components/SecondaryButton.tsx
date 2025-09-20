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
        `bg-[#000d59] text-white rounded-full px-5 py-2 inline-flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffe000] hover:bg-[#ffe000] hover:text-[#000d59] transition-colors font-prompt font-semibold ukpack2-secondary-btn ${className}`
      }
    >
      {text}
    </button>
  );
};

export default SecondaryButton;
