import React, { useState } from 'react';
import CustomizationScreen from '../components/CustomizationScreen';
import SelectionCard from '../components/SelectionCard';
import CtaButton from '../components/CtaButton';
import ProgressDots from '../components/ProgressDots';

const IconAir = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M6 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconFan = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <path d="M12 4v2M12 18v2M4 12h2M18 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconSeat = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="7" width="16" height="6" rx="2" fill="currentColor" />
    <path d="M6 13v4M18 13v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconWifi = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8c6-5 16-5 20 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M6 12c4-3 8-3 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 16c1-1 3-1 4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconPlug = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="3" width="4" height="8" rx="1" fill="currentColor" />
    <rect x="13" y="3" width="4" height="8" rx="1" fill="currentColor" />
    <path d="M8 11v6a4 4 0 0 0 8 0v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconTv = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconCup = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8h10v6a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 10h2a2 2 0 0 1 0 4h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconCam = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M19 8l2-2v10l-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AMENITIES = [
  { key: 'air', label: 'แอร์', icon: <IconAir /> },
  { key: 'fan', label: 'พัดลม', icon: <IconFan /> },
  { key: 'seat', label: 'ที่นั่งพิเศษ', icon: <IconSeat /> },
  { key: 'wifi', label: 'Wi-Fi', icon: <IconWifi /> },
  { key: 'plug', label: 'ปลั๊กไฟ', icon: <IconPlug /> },
  { key: 'tv', label: 'ทีวี', icon: <IconTv /> },
  { key: 'cup', label: 'ที่วางแก้ว', icon: <IconCup /> },
  { key: 'cam', label: 'กล้องวงจรปิ��', icon: <IconCam /> },
];

const AmenitiesScreen: React.FC = () => {
  const [selected, setSelected] = useState<string[]>(['แอร์']);

  const toggle = (label: string) => {
    setSelected((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  };

  return (
    <CustomizationScreen
      title="ปรับแต่งรถเมล์ของคุณ"
      footerContent={<div className="flex justify-end"><CtaButton text="ถัดไป" onClick={() => console.log('next', selected)} /></div>}
    >
      <div className="space-y-6">
        <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">Bus image preview</div>

        <div className="w-full flex items-center justify-center">
          <div className="bg-transparent rounded-md p-2">
            <ProgressDots total={5} active={3} />
          </div>
        </div>

        <h2 className="text-xl font-prompt font-semibold">ความสะดวกสบาย</h2>

        <div className="grid grid-cols-4 gap-4">
          {AMENITIES.map((a) => (
            <SelectionCard
              key={a.key}
              icon={a.icon}
              label={a.label}
              isSelected={selected.includes(a.label)}
              onClick={() => toggle(a.label)}
            />
          ))}
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default AmenitiesScreen;
