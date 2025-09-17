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
        `bg-[#ffe000] text-black rounded-full py-3 inline-flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000d59] hover:bg-[#000d59] hover:text-white transition-colors font-prompt font-semibold ${className}`
      }
      style={{ paddingLeft: 'calc(1.5rem + 7.5px)', paddingRight: 'calc(1.5rem + 7.5px)' }}
    >
      {text}
    </button>
  );
};

export default CtaButton;
