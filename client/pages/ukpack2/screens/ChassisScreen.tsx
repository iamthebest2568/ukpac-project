import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../../ukpack2/components/CustomizationScreen';
import SelectionCard from '../../ukpack2/components/SelectionCard';
import CtaButton from '../../ukpack2/components/CtaButton';
import ProgressDots from '../../ukpack2/components/ProgressDots';
import StepTabs from '../../ukpack2/components/StepTabs';
import ConfirmModal from '../components/ConfirmModal';

const IconSmall = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5ea1b3d990e44d49aa5441bc3a4b3bcc?format=webp&width=360"
    alt="รถเมล์ขนาดเล็ก 16-30 ที่นั่ง"
    className="max-h-12 w-auto object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconMedium = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fab8ddd78f9a0478bb27f5818928665f3?format=webp&width=360"
    alt="รถเมล์ขนาดกลาง 31-40 ที่นั่ง"
    className="max-h-12 w-auto object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconLarge = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fefc1e1ed3bcb4769b51d1544d43b3b5f?format=webp&width=360"
    alt="รถเมล์ขนาดใหญ่ 41–50 ที่นั่ง"
    className="max-h-12 w-auto object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconExtra = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9a8a7536ced24db19a65409fbba1c6b6?format=webp&width=360"
    alt="รถเมล์รุ่นพิเศษ 51+ ที่นั่ง"
    className="max-h-12 w-auto object-contain select-none"
    decoding="async"
    loading="eager"
  />
);

const OPTIONS = [
  { key: 'small', label: 'รถเมล์ขนาดเล็ก 16-30 ที่นั่ง', icon: <IconSmall /> },
  { key: 'medium', label: 'รถเมล์ขนาดกลาง 31-40 ที่นั่ง', icon: <IconMedium /> },
  { key: 'large', label: 'รถเมล์ขนาดใหญ่ 41-50 ที่นั่ง', icon: <IconLarge /> },
  { key: 'extra', label: 'รถเมล์รุ่นพิเศษ 51+ ที่นั่ง', icon: <IconExtra /> },
];

const HERO_IMAGE: Record<string, string> = {
  small: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5ea1b3d990e44d49aa5441bc3a4b3bcc?format=webp&width=800',
  medium: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fab8ddd78f9a0478bb27f5818928665f3?format=webp&width=800',
  large: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fefc1e1ed3bcb4769b51d1544d43b3b5f?format=webp&width=800',
  extra: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9a8a7536ced24db19a65409fbba1c6b6?format=webp&width=800',
};
const HERO_SHADOW = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb1e30b1544304677996b179fc27ae5c7?format=webp&width=800';
const HERO_STAR = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F026572d6e36d487bbb4798f7dd20d4a3?format=webp&width=256';

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
        theme="light"
        footerContent={<div className="flex justify-center"><CtaButton text="ถัดไป" onClick={handleNext} /></div>}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <ProgressDots total={5} currentStep={1} />
          </div>

          {/* Hero bus illustration with shadow overlay */}
          <div className="flex flex-col items-center mt-2">
            <div className="relative w-full flex items-center justify-center" style={{ minHeight: '160px' }}>
              {/* shadow only */}
              <img
                src={HERO_SHADOW}
                alt="เงารถ"
                className="absolute bottom-0 w-[72%] max-w-[420px] pointer-events-none select-none"
                decoding="async"
                loading="eager"
                aria-hidden="true"
              />
              {/* bus + star overlay inside same box for precise alignment */}
              <div className="relative w-[72%] max-w-[420px]">
                <img
                  src={HERO_IMAGE[selected]}
                  alt={selectedLabel}
                  className="w-full h-auto object-contain select-none"
                  decoding="async"
                  loading="eager"
                />
                <img
                  src={HERO_STAR}
                  alt="สัญลักษณ์ดาว"
                  className="absolute -top-2 -right-2 w-5 h-5 pointer-events-none select-none"
                  decoding="async"
                  loading="eager"
                  aria-hidden="true"
                />
              </div>
            </div>
            <p className="mt-2 font-prompt font-semibold text-[#001a73] text-center">
              รถที่ใช้งาน : {selectedLabel}
            </p>
          </div>

          {/* White content area with tabs + cards */}
          <div className="bg-white rounded-t-3xl -mt-2 p-4">
            <StepTabs active={1} />
            <div className="grid grid-cols-2 gap-4 mt-2">
              {OPTIONS.map((o) => (
                <SelectionCard
                  key={o.key}
                  icon={o.icon}
                  label={o.label}
                  isSelected={selected === o.key}
                  onClick={() => setSelected(o.key)}
                  variant="light"
                />
              ))}
            </div>
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
