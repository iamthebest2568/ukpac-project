import React from 'react';

const SuspenseFallback: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex space-x-4 items-center">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="h-4 bg-gray-200 rounded w-48" />
      </div>
    </div>
  );
};

export default SuspenseFallback;
