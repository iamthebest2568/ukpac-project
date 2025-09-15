import React from 'react';

interface StepTabsProps {
  active: number; // 1-based index
}

const iconCommon = "w-7 h-7";

const BusIcon = ({ active }: { active: boolean }) => (
  <svg className={iconCommon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="9" rx="2" stroke={active ? '#003366' : '#CCCCCC'} strokeWidth="1.8" />
    <circle cx="8" cy="17" r="1.6" fill={active ? '#003366' : '#CCCCCC'} />
    <circle cx="16" cy="17" r="1.6" fill={active ? '#003366' : '#CCCCCC'} />
  </svg>
);

const DeckIcon = ({ active }: { active: boolean }) => (
  <svg className={iconCommon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="7" width="16" height="3" rx="1" fill={active ? '#003366' : '#CCCCCC'} />
    <rect x="4" y="12" width="16" height="3" rx="1" fill={active ? '#003366' : '#CCCCCC'} />
  </svg>
);

const ChairIcon = ({ active }: { active: boolean }) => (
  <svg className={iconCommon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="5" width="10" height="7" rx="2" stroke={active ? '#003366' : '#CCCCCC'} strokeWidth="1.8" />
    <rect x="6" y="14" width="12" height="4" rx="1" fill={active ? '#003366' : '#CCCCCC'} />
  </svg>
);

const TvIcon = ({ active }: { active: boolean }) => (
  <svg className={iconCommon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="11" rx="2" stroke={active ? '#003366' : '#CCCCCC'} strokeWidth="1.8" />
    <rect x="9" y="18" width="6" height="2" rx="1" fill={active ? '#003366' : '#CCCCCC'} />
  </svg>
);

const ReceiptIcon = ({ active }: { active: boolean }) => (
  <svg className={iconCommon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="4" width="12" height="16" rx="1" stroke={active ? '#003366' : '#CCCCCC'} strokeWidth="1.8" />
    <rect x="8" y="8" width="8" height="1.8" rx="0.9" fill={active ? '#003366' : '#CCCCCC'} />
    <rect x="8" y="12" width="8" height="1.8" rx="0.9" fill={active ? '#003366' : '#CCCCCC'} />
  </svg>
);

const TAB1_ICON = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F334e1ba542cd4c8b9ae5a2d3218aade1?format=webp&width=256';
const TAB2_ICON = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb01ce26924af40298818d01f9f981186?format=webp&width=800';
const TAB3_ICON = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc3da8ccecbee48069923b34ed1e086b4?format=webp&width=800';

const StepTabs: React.FC<StepTabsProps> = ({ active }) => {
  const tabs = [BusIcon, DeckIcon, ChairIcon, TvIcon, ReceiptIcon];
  return (
    <div className="flex justify-around items-center border-b border-[#e5e7eb] mb-4">
      {tabs.map((Icon, idx) => {
        const isActive = idx + 1 === active;
        const commonClasses = `text-center py-2 ${isActive ? 'border-b-2 border-[#003366] text-[#003366]' : 'text-[#9CA3AF]'}`;
        return (
          <div key={idx} className={commonClasses} aria-current={isActive ? 'step' : undefined}>
            {idx === 0 ? (
              <img
                src={TAB1_ICON}
                alt={isActive ? 'โครงรถ (แท็บปัจจุบัน)' : 'โครงรถ'}
                className={`w-7 h-7 ${isActive ? '' : 'grayscale opacity-60'}`}
                decoding="async"
                loading="eager"
              />
            ) : idx === 1 ? (
              <img
                src={TAB2_ICON}
                alt={isActive ? 'แท็บที่ 2 (แอคทีฟ)' : 'แท็บที่ 2'}
                className={`w-7 h-7 ${isActive ? '' : 'grayscale opacity-60'}`}
                decoding="async"
                loading="eager"
              />
            ) : idx === 2 ? (
              <img
                src={TAB3_ICON}
                alt={isActive ? 'แท็บที่ 3 (แอคทีฟ)' : 'แท็บที่ 3'}
                className={`w-7 h-7 ${isActive ? '' : 'grayscale opacity-60'}`}
                decoding="async"
                loading="eager"
              />
            ) : (
              <Icon active={isActive} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepTabs;
