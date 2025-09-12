import React from 'react';

interface SummaryCardProps {
  designData: Record<string, any>;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ designData }) => {
  const entries = Object.entries(designData || {});

  return (
    <div className="bg-white rounded-lg p-4 text-sm text-gray-800">
      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
        {entries.map(([k, v]) => (
          <React.Fragment key={k}>
            <div className="font-sarabun text-xs text-gray-500 break-words">{k}</div>
            <div className="font-sarabun text-sm font-semibold break-words">{Array.isArray(v) ? v.join(', ') : String(v)}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;
