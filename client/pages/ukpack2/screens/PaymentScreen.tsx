import React, { useState } from "react";
import CustomizationScreen from "../components/CustomizationScreen";
import SelectionCard from "../components/SelectionCard";
import CtaButton from "../components/CtaButton";
import { useNavigate } from "react-router-dom";
import StepTabs from "../components/StepTabs";

const IconCash = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="7"
      width="20"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M12 10v4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const IconScan = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M21 3v4M3 21v-4M21 21v-4M3 3v4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const IconTap = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="6"
      width="20"
      height="12"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M7 3v3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const IconQr = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="3"
      width="6"
      height="6"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="15"
      y="3"
      width="6"
      height="6"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="3"
      y="15"
      width="6"
      height="6"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const MONEY_ICON = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbc8b22cedfbb4640a702f724881f196d?format=webp&width=800';
const SCAN_ICON = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb8992da4be824b339d3df5f0a076ed93?format=webp&width=800';
const SCAN2_ICON = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F56620e798eb94153b2390271f30d0dae?format=webp&width=800';
const TOUCH_ICON = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdb2e47a586b841d1af014e9196f3c411?format=webp&width=800';
const MONTHLY_ICON = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fca6467eff0c74a77a8e5757f25a24e41?format=webp&width=800';
const BUS_EMPLOY_ICON = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F41c089c5dd4b448993c4e02c02cdf7ac?format=webp&width=800';

const OPTIONS = [
  { key: "cash", label: "เงินสด", icon: <IconCash /> },
  { key: "scan", label: "สแกนจ่าย", icon: <IconScan /> },
  { key: "scan2", label: "สแกนจ่าย 2", icon: null },
  { key: "tap", label: "แตะบัตร", icon: <IconTap /> },
  { key: "qr", label: "กระเป๋ารถเมล์", icon: <IconQr /> },
  { key: "monthly", label: "ตั๋วรายเดือน/รอบ", icon: null },
];

const PaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(["เงินสด"]);

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const handleNext = () => {
    try {
      sessionStorage.setItem("design.payment", JSON.stringify(selected));
    } catch (e) {}
    navigate("/ukpack2/doors");
  };

  return (
    <CustomizationScreen
      title="ปรับแต่งรถเมล์ของคุณ"
      theme="light"
      footerContent={
        <div className="flex justify-center">
          <CtaButton text="ถัดไป" onClick={handleNext} />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="w-full rounded-md flex flex-col items-center justify-center gap-2">
          {/* show selected hero bus image from chassis selection */}
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
          <StepTabs active={4} />

          <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">การจ่ายเงิน</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {OPTIONS.map((o) => {
              const isSel = selected.includes(o.label);
              const iconNode = o.key === 'cash' ? (
                <img
                  src={MONEY_ICON}
                  alt={o.label}
                  className={`h-8 w-8 object-contain select-none ${isSel ? '' : 'grayscale opacity-60'}`}
                  decoding="async"
                  loading="eager"
                />
              ) : o.key === 'scan' ? (
                <img
                  src={SCAN_ICON}
                  alt={o.label}
                  className={`h-8 w-8 object-contain select-none ${isSel ? '' : 'grayscale opacity-60'}`}
                  decoding="async"
                  loading="eager"
                />
              ) : o.key === 'scan2' ? (
                <img
                  src={SCAN2_ICON}
                  alt={o.label}
                  className={`h-8 w-8 object-contain select-none ${isSel ? '' : 'grayscale opacity-60'}`}
                  decoding="async"
                  loading="eager"
                />
              ) : o.key === 'tap' ? (
                <img
                  src={TOUCH_ICON}
                  alt={o.label}
                  className={`h-8 w-8 object-contain select-none ${isSel ? '' : 'grayscale opacity-60'}`}
                  decoding="async"
                  loading="eager"
                />
              ) : o.key === 'qr' ? (
                <img
                  src={BUS_EMPLOY_ICON}
                  alt={o.label}
                  className={`h-8 w-8 object-contain select-none ${isSel ? '' : 'grayscale opacity-60'}`}
                  decoding="async"
                  loading="eager"
                />
              ) : o.key === 'monthly' ? (
                <img
                  src={MONTHLY_ICON}
                  alt={o.label}
                  className={`h-8 w-8 object-contain select-none ${isSel ? '' : 'grayscale opacity-60'}`}
                  decoding="async"
                  loading="eager"
                />
              ) : (
                o.icon
              );
              return (
                <SelectionCard
                  key={o.key}
                  icon={iconNode}
                  label={o.label}
                  isSelected={isSel}
                  onClick={() => toggle(o.label)}
                  variant="light"
                />
              );
            })}
          </div>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default PaymentScreen;
