import React from 'react';

const SourceSelectionSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-[900px]">
        <div className="h-72 bg-gray-100 rounded-b-[60%] mb-6 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse w-3/4" />
        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="h-12 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SourceSelectionSkeleton;
