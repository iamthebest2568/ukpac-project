import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../components/CustomizationScreen';
import SelectionCard from '../components/SelectionCard';
import CtaButton from '../components/CtaButton';

const IconDoor = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16" cy="12" r="1" fill="currentColor" />
  </svg>
);
const IconRamp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 20h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 16l4-8 4 6 2-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconHighLow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 6v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DoorScreen: React.FC = () => {
  const navigate = useNavigate();
  const [doorChoice, setDoorChoice] = useState<'1' | '2'>('1');
  const [hasRamp, setHasRamp] = useState<boolean>(false);
  const [highLow, setHighLow] = useState<boolean>(false);

  const handleNext = () => {
    try {
      sessionStorage.setItem('design.doors', JSON.stringify({ doorChoice, hasRamp, highLow }));
    } catch (e) {}
    navigate('/ukpack2/design');
  };

  return (
    <CustomizationScreen
      title="ปรับแต่งรถเมล์ของคุณ"
      footerContent={<div className="flex justify-end"><CtaButton text="ถัดไป" onClick={handleNext} /></div>}
    >
      <div className="space-y-6">
        <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">Bus image preview</div>

        <h2 className="text-xl font-prompt font-semibold">ประตู</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Radio group for 1 or 2 doors */}
          <SelectionCard
            icon={<IconDoor />}
            label={'1 ประตู'}
            isSelected={doorChoice === '1'}
            onClick={() => setDoorChoice('1')}
          />
          <SelectionCard
            icon={<IconDoor />}
            label={'2 ประตู'}
            isSelected={doorChoice === '2'}
            onClick={() => setDoorChoice('2')}
          />

          {/* Independent toggles */}
          <SelectionCard
            icon={<IconRamp />}
            label={'ทางลาดสำหรับรถเข็น/ผู้พิการ'}
            isSelected={hasRamp}
            onClick={() => setHasRamp((s) => !s)}
          />
          <SelectionCard
            icon={<IconHighLow />}
            label={'ประตูสูง/ต่ำ'}
            isSelected={highLow}
            onClick={() => setHighLow((s) => !s)}
          />
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default DoorScreen;
