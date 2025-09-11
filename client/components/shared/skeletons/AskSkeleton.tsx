import React from 'react';

const AskSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-[900px]">
        <div className="h-32 bg-gray-100 rounded mb-6 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse w-1/2" />
        <div className="mt-6 space-y-4">
          <div className="h-14 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-14 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-14 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default AskSkeleton;
