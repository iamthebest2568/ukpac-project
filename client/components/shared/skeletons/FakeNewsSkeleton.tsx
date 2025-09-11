import React from 'react';

const FakeNewsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-[800px]">
        <div className="h-[220px] bg-gray-100 rounded-lg mb-6 animate-pulse skeleton-shimmer" />
        <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse skeleton-shimmer w-3/4" />
        <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse skeleton-shimmer w-1/2" />
        <div className="mt-8 space-y-4">
          <div className="h-16 bg-gray-100 rounded-full animate-pulse skeleton-shimmer" />
          <div className="h-16 bg-gray-100 rounded-full animate-pulse skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};

export default FakeNewsSkeleton;
