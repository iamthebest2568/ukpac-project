import React from 'react';

const BudgetSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-[900px]">
        <div className="h-60 bg-gray-100 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-gray-100 rounded animate-pulse" />
          <div className="h-12 bg-gray-100 rounded animate-pulse" />
          <div className="h-12 bg-gray-100 rounded animate-pulse" />
          <div className="h-12 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default BudgetSkeleton;
