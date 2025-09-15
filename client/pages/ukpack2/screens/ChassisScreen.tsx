import React, { useState } from 'react';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../../ukpack2/components/CustomizationScreen';
import SelectionCard from '../../ukpack2/components/SelectionCard';
import CtaButton from '../../ukpack2/components/CtaButton';
import ProgressDots from '../../ukpack2/components/ProgressDots';
import ConfirmModal from '../components/ConfirmModal';

const IconSmall = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="7" cy="17" r="1.5" fill="currentColor" />
    <circle cx="17" cy="17" r="1.5" fill="currentColor" />
  </svg>
);
const IconMedium = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="5" width="22" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="6" cy="18" r="1.5" fill="currentColor" />
    <circle cx="18" cy="18" r="1.5" fill="currentColor" />
  </svg>
);
const IconLarge = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="4" width="23" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="5" cy="19" r="1.5" fill="currentColor" />
    <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    <circle cx="19" cy="19" r="1.5" fill="currentColor" />
  </svg>
);
const IconExtra = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="3" width="23" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="6" cy="20" r="1.5" fill="currentColor" />
    <circle cx="12" cy="20" r="1.5" fill="currentColor" />
    <circle cx="18" cy="20" r="1.5" fill="currentColor" />
  </svg>
);

const OPTIONS = [
  { key: 'small', label: 'รถเมล์ขนาดเล็ก 16-30 ที่นั่ง', icon: <IconSmall /> },
  { key: 'medium', label: 'รถเมล์ขนาดกลาง 31-40 ที่นั่ง', icon: <IconMedium /> },
  { key: 'large', label: 'รถเมล์ขนาดใหญ่ 41-50 ที่นั่ง', icon: <IconLarge /> },
  { key: 'extra', label: 'รถเมล์รุ่นพิเศษ 51+ ที่นั่ง', icon: <IconExtra /> },
];

const ChassisScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>(OPTIONS[0].key);
  const selectedLabel = useMemo(() => {
    const found = OPTIONS.find(o => o.key === selected)?.label || '';
    return found.replace(/(\d+)-(\d+)/, '$1–$2');
  }, [selected]);
  const [isExitModalOpen, setExitModalOpen] = useState(false);

  const handleNext = () => {
    try {
      sessionStorage.setItem('design.chassis', selected);
    } catch (e) {
      // ignore
    }
    navigate('/ukpack2/seating');
  };

  const confirmExit = () => {
    setExitModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <CustomizationScreen
        title="ปรับแต่งรถเมล์ของคุณ"
        onBack={() => setExitModalOpen(true)}
        footerContent={<div className="flex justify-center"><CtaButton text="ถัดไป" onClick={handleNext} /></div>}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <ProgressDots total={5} currentStep={1} />
          </div>

          {/* Hero bus illustration */}
          <div className="flex flex-col items-center mt-2">
            <div className="text-white">
              <svg width="240" height="160" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="120" cy="138" rx="100" ry="14" fill="#00D5F9"/>
                <path d="M206 22 l6 10 h-8 l6 10 l-8-6 l-8 6 l6-10 h-8 l6-10 l2 8 z" fill="#FFE000"/>
                <rect x="30" y="50" width="180" height="64" rx="6" stroke="#051650" strokeWidth="6"/>
                <rect x="44" y="62" width="36" height="22" rx="3" stroke="#051650" strokeWidth="5"/>
                <rect x="84" y="62" width="36" height="22" rx="3" stroke="#051650" strokeWidth="5"/>
                <rect x="124" y="62" width="36" height="22" rx="3" stroke="#051650" strokeWidth="5"/>
                <rect x="164" y="62" width="32" height="22" rx="3" stroke="#051650" strokeWidth="5"/>
                <rect x="190" y="74" width="8" height="26" fill="#051650"/>
                <circle cx="76" cy="126" r="16" stroke="#051650" strokeWidth="6" fill="none"/>
                <circle cx="76" cy="126" r="8" fill="#051650"/>
                <circle cx="174" cy="126" r="16" stroke="#051650" strokeWidth="6" fill="none"/>
                <circle cx="174" cy="126" r="8" fill="#051650"/>
              </svg>
            </div>
            <p className="mt-2 font-prompt font-semibold text-[#001a73] text-center">
              รถที่ใช้งาน : {selectedLabel}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {OPTIONS.map((o) => (
              <SelectionCard
                key={o.key}
                icon={o.icon}
                label={o.label}
                isSelected={selected === o.key}
                onClick={() => setSelected(o.key)}
              />
            ))}
          </div>
        </div>
      </CustomizationScreen>

      <ConfirmModal
        isOpen={isExitModalOpen}
        title="ออกจากหน้าจอ"
        message="คุณแน่ใจหรือไม่ว่าต้องการออก? การเปลี่ยนแปลงของคุณจะไม่ถูกบันทึก"
        onConfirm={confirmExit}
        onCancel={() => setExitModalOpen(false)}
      />
    </>
  );
};

export default ChassisScreen;
