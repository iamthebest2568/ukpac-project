import React from 'react';

export const EndSequenceSkeleton: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-white">
    <div className="w-full max-w-[800px]">
      <div className="h-40 bg-gray-100 rounded mb-6 animate-pulse skeleton-shimmer" />
      <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse skeleton-shimmer w-2/3" />
      <div className="mt-6 h-48 bg-gray-100 rounded animate-pulse skeleton-shimmer" />
    </div>
  </div>
);

export const EndScreenSkeleton: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-white">
    <div className="w-full max-w-[600px] text-center">
      <div className="h-32 bg-gray-100 rounded mb-6 animate-pulse skeleton-shimmer mx-auto" />
      <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse skeleton-shimmer w-1/2 mx-auto" />
    </div>
  </div>
);

export default EndSequenceSkeleton;
