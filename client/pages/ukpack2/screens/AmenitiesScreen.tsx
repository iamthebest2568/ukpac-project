import React, { useState } from "react";
import CustomizationScreen from "../components/CustomizationScreen";
import ConfirmModal from "../components/ConfirmModal";
import SelectionCard from "../components/SelectionCard";
import CtaButton from "../components/CtaButton";

const IconAir = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fee1c18a935564e92bb49991fac3b76df?format=webp&width=800"
    alt="แอร์"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconFan = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe01792ee89e240808ed47d8576b55d71?format=webp&width=800"
    alt="พัดลม"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconSeat = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F93439b2533284cdf914fc93cafa1cf26?format=webp&width=800"
    alt="หน้าต่างเปิดได้"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconWifi = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb0789bfd1100472f8351704764607d31?format=webp&width=800"
    alt="ที่จับ/รา��ยืน"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconPlug = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F09a78e31a3de44e98772b0eef382af6f?format=webp&width=800"
    alt="ช่องชาร์จมือถือ/USB"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconTv = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcb0cbf9ef6764e2d9e6f06e87827f5e9?format=webp&width=800"
    alt="Wi‑Fi ฟรี"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconCup = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe903bdf27bab4175824c159bc19a02ba?format=webp&width=800"
    alt="ระบบประกาศบอกป้าย(เสียง/จอ)"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconCam = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="7"
      width="14"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M19 8l2-2v10l-2-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AMENITIES = [
  { key: "air", label: "แอร์", icon: <IconAir /> },
  { key: "fan", label: "พัดลม", icon: <IconFan /> },
  { key: "seat", label: "ที่นั่งพิเศษ", icon: <IconSeat /> },
  { key: "wifi", label: "ที่จับ/ราวยืนที่ปลอดภัย", icon: <IconWifi /> },
  { key: "plug", label: "ช่องชาร์จมือถือ/USB", icon: <IconPlug /> },
  { key: "tv", label: "Wi‑Fi ฟรี", icon: <IconTv /> },
  { key: "cup", label: "ระบบประกาศบอกป้าย(เสียง/จอ)", icon: <IconCup /> },
  { key: "cam", label: "กล้องวงจรปิด", icon: <IconCam /> },
];

import { useNavigate } from "react-router-dom";
import StepTabs from "../components/StepTabs";

const AmenitiesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(["แอร์"]);

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const handleNext = () => {
    try {
      sessionStorage.setItem("design.amenities", JSON.stringify(selected));
    } catch (e) {}
    navigate("/ukpack2/payment");
  };

  // Selected chassis preview (reusing mapping from SeatingScreen)
  const CHASSIS_LABELS: Record<string, string> = {
    small: 'รถเมล์ขน���ดเล็ก 16–30 ที่นั่ง',
    medium: 'รถเมล์ขนาดกลาง 31–40 ที่นั่ง',
    large: 'รถเมล์ขนาดใหญ่ 41–50 ที่นั่���',
    extra: 'รถเมล์รุ่นพิเศษ 51+ ที่นั่ง',
  };
  const HERO_IMAGE: Record<string, string> = {
    small: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5ea1b3d990e44d49aa5441bc3a4b3bcc?format=webp&width=800',
    medium: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fab8ddd78f9a0478bb27f5818928665f3?format=webp&width=800',
    large: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fefc1e1ed3bcb4769b51d1544d43b3b5f?format=webp&width=800',
    extra: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9a8a7536ced24db19a65409fbba1c6b6?format=webp&width=800',
  };
  const selectedChassis = (() => {
    try {
      const saved = sessionStorage.getItem('design.chassis');
      return (saved || 'medium') as keyof typeof CHASSIS_LABELS;
    } catch {
      return 'medium' as const;
    }
  })();
  const selectedLabel = CHASSIS_LABELS[selectedChassis] || '';
  const selectedBusImage = HERO_IMAGE[selectedChassis];
  const [isExitModalOpen, setExitModalOpen] = useState(false);

  return (
    <CustomizationScreen
      title="ปรั���แต่งรถเมล์ของคุณ"
      theme="light"
      footerContent={
        <div className="flex justify-center">
          <CtaButton text="ถัดไป" onClick={handleNext} />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="w-full rounded-md flex flex-col items-center justify-center gap-2">
          {selectedBusImage ? (
            <img
              src={selectedBusImage}
              alt={`ภาพรถ - ${selectedLabel}`}
              className="h-48 w-auto object-contain select-none"
              decoding="async"
              loading="eager"
            />
          ) : (
            <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">
              Bus image preview (ภาพสำหรับรุ่นนี้จะถูกเพิ่มภา���หลัง)
            </div>
          )}
          <p className="mt-1 font-prompt font-semibold text-[#001a73] text-center">
            รถที่ใช้งาน : {selectedLabel}
          </p>
        </div>
        <div className="bg-white rounded-t-3xl -mt-2 p-4">
          <StepTabs active={3} />

          <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">ความสะดวกสบาย</h2>

          <div className="grid grid-cols-4 gap-4">
            {AMENITIES.map((a) => (
              <SelectionCard
                key={a.key}
                icon={a.icon}
                label={a.label}
                isSelected={selected.includes(a.label)}
                onClick={() => toggle(a.label)}
                variant="light"
              />
            ))}
          </div>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default AmenitiesScreen;
