import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../../ukpack2/components/CustomizationScreen";
import SelectionCard from "../../ukpack2/components/SelectionCard";
import CtaButton from "../../ukpack2/components/CtaButton";
import StepTabs from "../../ukpack2/components/StepTabs";
import ConfirmModal from "../components/ConfirmModal";
import { clearDesignStorage } from "../../ukpack2/utils/clearDesign";

const AMENITIES_ICON_SMALL = {
  แอร์: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fee1c18a935564e92bb49991fac3b76df?format=webp&width=800",
  พัดลม:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe01792ee89e240808ed47d8576b55d71?format=webp&width=800",
  ที่นั่งพิเศษ:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F93439b2533284cdf914fc93cafa1cf26?format=webp&width=800",
  "ที่จับ/ราวยืนที่ปลอดภัย":
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb0789bfd1100472f8351704764607d31?format=webp&width=800",
};
const PAYMENT_ICON_SMALL: Record<string, string> = {
  เงินสด:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbc8b22cedfbb4640a702f724881f196d?format=webp&width=800",
  สแกนจ่าย:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb8992da4be824b339d3df5f0a076ed93?format=webp&width=800",
  "สแกนจ่าย 2":
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F56620e798eb94153b2390271f30d0dae?format=webp&width=800",
  แตะบัตร:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdb2e47a586b841d1af014e9196f3c411?format=webp&width=800",
  กระเป๋ารถเมล์:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F41c089c5dd4b448993c4e02c02cdf7ac?format=webp&width=800",
  "ตั๋วรายเดือน/รอบ":
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fca6467eff0c74a77a8e5757f25a24e41?format=webp&width=800",
};
const DOOR_ICON_SMALL: Record<string, string> = {
  "1": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9811f9bca05c43feae9eafdcbab3c8d9?format=webp&width=800",
  "2": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8f9b21942af243b3b80b0e5ac8b12631?format=webp&width=800",
  ramp: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fece2b6fc843340f0997f2fd7d3ca0aea?format=webp&width=800",
  emergency:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F98de0624be3d4ae6b96d83edcf8891f9?format=webp&width=800",
};

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
    className="max-h-12 w-auto object-contain select-none -translate-y-0.5"
    decoding="async"
    loading="eager"
  />
);
const IconExtra = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9a8a7536ced24db19a65409fbba1c6b6?format=webp&width=360"
    alt="รถกระบะดัดแปลง 8-12 ที่นั่ง"
    className="max-h-12 w-auto object-contain select-none -translate-y-0.5"
    decoding="async"
    loading="eager"
  />
);

const OPTIONS = [
  { key: "small", label: "รถเมล์ขนาดเล็ก 16-30 ที่นั่ง", icon: <IconSmall /> },
  {
    key: "medium",
    label: "รถเมล์มา��รฐาน 30-60 ที่นั่ง",
    icon: <IconMedium />,
  },
  { key: "large", label: <><span>รถตู้โดยสาร</span><br />9-15 ที่นั่ง</>, icon: <IconLarge /> },
  { key: "extra", label: "รถกะบะดัดแปลง 8-12 ที่นั่ง", icon: <IconExtra /> },
];

const HERO_IMAGE: Record<string, string> = {
  small:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5ea1b3d990e44d49aa5441bc3a4b3bcc?format=webp&width=800",
  medium:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fab8ddd78f9a0478bb27f5818928665f3?format=webp&width=800",
  large:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fefc1e1ed3bcb4769b51d1544d43b3b5f?format=webp&width=800",
  extra:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9a8a7536ced24db19a65409fbba1c6b6?format=webp&width=800",
};
const HERO_SHADOW =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb1e30b1544304677996b179fc27ae5c7?format=webp&width=800";
const HERO_STAR =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F026572d6e36d487bbb4798f7dd20d4a3?format=webp&width=256";

const ChassisScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>(OPTIONS[0].key);
  const selectedLabel = useMemo(() => {
    const found = OPTIONS.find((o) => o.key === selected)?.label || "";
    return found.replace(/(\d+)-(\d+)/, "$1–$2");
  }, [selected]);
  const [isExitModalOpen, setExitModalOpen] = useState(false);

  // Clear any previous unfinished selections when (re)entering the flow
  useEffect(() => {
    clearDesignStorage();
  }, []);

  const handleNext = () => {
    try {
      sessionStorage.setItem("design.chassis", selected);
    } catch (e) {
      // ignore
    }
    navigate("/ukpack2/seating");
  };

  const confirmExit = () => {
    setExitModalOpen(false);
    navigate("/");
  };

  return (
    <>
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
          {/* Hero bus illustration with shadow overlay */}
          <div className="flex flex-col items-center mt-2">
            <div
              className="relative w-full flex items-center justify-center"
              style={{ minHeight: "160px" }}
            >
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
                {(() => {
                  const amenities = (() => {
                    try {
                      const raw = sessionStorage.getItem("design.amenities");
                      return raw ? (JSON.parse(raw) as string[]) : [];
                    } catch {
                      return [] as string[];
                    }
                  })();
                  const payments = (() => {
                    try {
                      const raw = sessionStorage.getItem("design.payment");
                      return raw ? (JSON.parse(raw) as string[]) : [];
                    } catch {
                      return [] as string[];
                    }
                  })();
                  const doors = (() => {
                    try {
                      const raw = sessionStorage.getItem("design.doors");
                      if (!raw) return null;
                      const parsed = JSON.parse(raw);
                      return typeof parsed === "string"
                        ? parsed
                        : parsed?.doorChoice ||
                            (parsed?.hasRamp
                              ? "ramp"
                              : parsed?.highLow
                                ? "emergency"
                                : null);
                    } catch {
                      return sessionStorage.getItem("design.doors");
                    }
                  })();
                  const overlay = [
                    ...(amenities || []),
                    ...(payments || []),
                    ...(doors ? [doors as string] : []),
                  ];
                  return overlay.length > 0 ? (
                    <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 flex flex-wrap justify-center gap-2 z-20 max-w-[80%]">
                      {overlay.map((lab, i) => {
                        const src =
                          AMENITIES_ICON_SMALL[lab] ||
                          PAYMENT_ICON_SMALL[lab] ||
                          DOOR_ICON_SMALL[lab];
                        return (
                          <div
                            key={`${lab}-${i}`}
                            className="bg-white/90 backdrop-blur rounded-full p-1 shadow-md h-8 w-8 flex items-center justify-center"
                          >
                            {src ? (
                              <img
                                src={src}
                                alt={lab}
                                className="h-5 w-5 object-contain"
                              />
                            ) : (
                              <div className="text-xs">{lab}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : null;
                })()}

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
              <span className="chassis-label-mobile">รถที่ใช้งาน : </span>
              {selectedLabel}
            </p>
          </div>

          {/* White content area with tabs + cards */}
          <div className="bg-white rounded-2xl -mt-2 p-4 border border-gray-400">
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
        message="คุณแน่ใ���หรือไม่ว่าต้องการออก? การเปลี่ยนแปลงของคุณจะไม่ถูกบันทึก"
        onConfirm={confirmExit}
        onCancel={() => setExitModalOpen(false)}
      />
    </>
  );
};

export default ChassisScreen;
