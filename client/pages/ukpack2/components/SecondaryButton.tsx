import React from 'react';

import './ukpack2-buttons.css';

interface SecondaryButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ text, onClick, className = '', style }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        `bg-[#ffe000] text-black rounded-full px-5 py-2 inline-flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000d59] hover:bg-opacity-95 transition-colors font-prompt font-semibold ukpack2-secondary-btn ${className}`
      }
      style={style}
    >
      {text}
    </button>
  );
};

export default SecondaryButton;
