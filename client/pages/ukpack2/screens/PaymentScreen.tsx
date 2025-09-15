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

const OPTIONS = [
  { key: "cash", label: "เงินสด", icon: <IconCash /> },
  { key: "scan", label: "สแกนจ่าย", icon: <IconScan /> },
  { key: "tap", label: "แตะบัตร", icon: <IconTap /> },
  { key: "qr", label: "QR/สแกน", icon: <IconQr /> },
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
        <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">
          Bus image preview
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
