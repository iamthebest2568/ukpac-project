import React, { useState } from 'react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../components/CustomizationScreen';
import SelectionCard from '../components/SelectionCard';
import CtaButton from '../components/CtaButton';
import StepTabs from "../components/StepTabs";

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
      theme="light"
      footerContent={<div className="flex justify-center"><CtaButton text="ถัดไป" onClick={handleNext} /></div>}
    >
      <div className="space-y-6">
        <div className="w-full rounded-md flex flex-col items-center justify-center gap-2">
          {(() => {
            const CHASSIS_LABELS: Record<string, string> = {
              small: 'รถเมล์ขนาดเล็ก 16–30 ที่นั่ง',
              medium: 'รถเมล์ขนาดกลาง 31–40 ที่นั่ง',
              large: 'รถเมล์ขนาดใหญ่ 41-50 ที่นั่ง',
              extra: 'รถเมล์รุ่นพิเศษ 51+ ที่นั่ง',
            };
            const HERO_IMAGE: Record<string, string> = {
              small: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5ea1b3d990e44d49aa5441bc3a4b3bcc?format=webp&width=800',
              medium: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fab8ddd78f9a0478bb27f5818928665f3?format=webp&width=800',
              large: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fefc1e1ed3bcb4769b51d1544d43b3b5f?format=webp&width=800',
              extra: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9a8a7536ced24db19a65409fbba1c6b6?format=webp&width=800',
            };
            let selected = 'medium';
            try {
              const saved = sessionStorage.getItem('design.chassis');
              if (saved) selected = saved;
            } catch (e) {}
            const label = CHASSIS_LABELS[selected] || '';
            const img = HERO_IMAGE[selected];
            return img ? (
              <>
                <img src={img} alt={`ภาพรถ - ${label}`} className="h-48 w-auto object-contain select-none" decoding="async" loading="eager" />
                <p className="mt-1 font-prompt font-semibold text-[#001a73] text-center">รถที่ใช้งาน : {label}</p>
              </>
            ) : (
              <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">Bus image preview</div>
            );
          })()}
        </div>
        <div className="bg-white rounded-t-3xl -mt-2 p-4">
          <StepTabs active={5} />

          <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">ประตู</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Radio group for 1 or 2 doors */}
            <SelectionCard
              icon={<IconDoor />}
              label={'1 ประตู'}
              isSelected={doorChoice === '1'}
              onClick={() => setDoorChoice('1')}
              variant="light"
            />
            <SelectionCard
              icon={<IconDoor />}
              label={'2 ประตู'}
              isSelected={doorChoice === '2'}
              onClick={() => setDoorChoice('2')}
              variant="light"
            />

            {/* Independent toggles */}
            <SelectionCard
              icon={<IconRamp />}
              label={'ทางลาดสำหรับรถเข็น/ผู้พิการ'}
              isSelected={hasRamp}
              onClick={() => setHasRamp((s) => !s)}
              variant="light"
            />
            <SelectionCard
              icon={<IconHighLow />}
              label={'ประตูสูง/ต่ำ'}
              isSelected={highLow}
              onClick={() => setHighLow((s) => !s)}
              variant="light"
            />
          </div>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default DoorScreen;
