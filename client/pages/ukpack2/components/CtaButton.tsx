import React from 'react';

interface CtaButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const CtaButton: React.FC<CtaButtonProps> = ({ text, onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        `bg-[#ffe000] text-black rounded-full px-6 py-3 inline-flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffe000] font-prompt font-semibold ${className}`
      }
    >
      {text}
    </button>
  );
};

export default CtaButton;
