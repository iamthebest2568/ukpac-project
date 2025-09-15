import React from 'react';

const InfoBubbleCard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="bg-gray-100 text-[#001a73] rounded-xl p-5 shadow-sm">
        {children}
      </div>
      {/* speech bubble tail */}
      <div className="absolute left-8 -bottom-3 w-6 h-6 bg-gray-100 transform rotate-45" />
    </div>
  );
};

export default InfoBubbleCard;
