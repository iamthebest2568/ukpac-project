import React from "react";

const MN3Skeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-full">
        <div className="h-40 bg-gray-100 rounded mb-6 animate-pulse skeleton-shimmer" />
        <div className="grid grid-cols-1 gap-4">
          <div className="h-20 bg-gray-100 rounded-full animate-pulse skeleton-shimmer" />
          <div className="h-20 bg-gray-100 rounded-full animate-pulse skeleton-shimmer" />
          <div className="h-20 bg-gray-100 rounded-full animate-pulse skeleton-shimmer" />
        </div>
        <div className="mt-8 h-16 bg-gray-100 rounded-full animate-pulse skeleton-shimmer" />
      </div>
    </div>
  );
};

export default MN3Skeleton;
