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
    alt="ที่จับ/ราวยืน"
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

const AMENITIES = [
  { key: "air", label: "แอร์", icon: <IconAir /> },
  { key: "fan", label: "พัดลม", icon: <IconFan /> },
  { key: "seat", label: "ที่นั่งพิเศษ", icon: <IconSeat /> },
  { key: "wifi", label: "ที่จับ/ราวยืนที่ปลอดภัย", icon: <IconWifi /> },
  { key: "plug", label: "ช่องชาร์จมือถือ/USB", icon: <IconPlug /> },
  { key: "tv", label: "Wi‑Fi ฟรี", icon: <IconTv /> },
  { key: "cup", label: "ระบบประกาศบอกป้าย(เสียง/จอ)", icon: <IconCup /> },
];

import { useNavigate } from "react-router-dom";
import StepTabs from "../components/StepTabs";
import HeroWithShadow from "../components/HeroWithShadow";

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
    small: "รถเมล์ขนาดเล็ก 16–30 ที่นั่ง",
    medium: "รถเมล์ขนาดกลาง 31–40 ที่นั่ง",
    large: "รถเมล์ขนาดใหญ่ 41–50 ที่นั่ง",
    extra: "รถกระบะดัดแปลง 8-12 ที่นั่ง",
  };
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
  const selectedChassis = (() => {
    try {
      const saved = sessionStorage.getItem("design.chassis");
      return (saved || "medium") as keyof typeof CHASSIS_LABELS;
    } catch {
      return "medium" as const;
    }
  })();
  const selectedLabel = CHASSIS_LABELS[selectedChassis] || "";
  const selectedBusImage = HERO_IMAGE[selectedChassis];
  const [isExitModalOpen, setExitModalOpen] = useState(false);

  const OVERLAY_ICON_SRC: Record<string, string> = {
    // labels
    แอร์: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F02548238f8184e808929075a27733533?format=webp&width=800",
    พัดลม:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdcae7affa4fe43e38aa5c78ca608e39e?format=webp&width=800",
    ที่นั่งพิเศษ:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F788c9e78d6944fc8a5088cc00aa40697?format=webp&width=800", // ใช้ไอคอนหน้าต่างเปิดได้
    หน้าต่างเปิดได้:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F788c9e78d6944fc8a5088cc00aa40697?format=webp&width=800",
    "ที่จับ/ราวยืนที่ปลอดภัย":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1cae4f7306834a6eb0d86be09e05bfdd?format=webp&width=800",
    "ช่องชาร์จมือถือ/USB":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fba274e72720c4a1b9695e83dbf8c1fe9?format=webp&width=800",
    "Wi‑Fi ฟรี":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F63dc13fe1fab446a9da88bfb297d9c6d?format=webp&width=800",
    "ระบบประกาศบอกป้าย(เสียง/จอ)":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F35b324f49ad84b71a92ae80b0b39f7cd?format=webp&width=800",
    // keys (fallback)
    air: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F02548238f8184e808929075a27733533?format=webp&width=800",
    fan: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdcae7affa4fe43e38aa5c78ca608e39e?format=webp&width=800",
    seat: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F788c9e78d6944fc8a5088cc00aa40697?format=webp&width=800",
    wifi: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1cae4f7306834a6eb0d86be09e05bfdd?format=webp&width=800",
    plug: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fba274e72720c4a1b9695e83dbf8c1fe9?format=webp&width=800",
    tv: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F63dc13fe1fab446a9da88bfb297d9c6d?format=webp&width=800",
    cup: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F35b324f49ad84b71a92ae80b0b39f7cd?format=webp&width=800",
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
          {selectedBusImage ? (
            <HeroWithShadow>
              <div className="relative">
                {/* Overlay selected amenity icons on top of the bus image */}
                {selected.length > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 -top-4 flex flex-wrap justify-center content-center gap-2 z-20 max-w-[80%]">
                    {selected
                      .slice()
                      .filter((l) => AMENITIES.some((a) => a.label === l))
                      .sort((a, b) => a.localeCompare(b, "th"))
                      .map((label, i) => {
                        const amen = AMENITIES.find((a) => a.label === label);
                        const src =
                          OVERLAY_ICON_SRC[label] ||
                          (amen ? OVERLAY_ICON_SRC[amen.key] : undefined);
                        return (
                          <div
                            key={`${label}-${i}`}
                            className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                          >
                            {src ? (
                              <img
                                src={
                                  src && src.includes("width=")
                                    ? src.replace(/width=\d+/, "width=1600")
                                    : src
                                }
                                alt={label}
                                className="h-7 w-7 md:h-8 md:w-8 object-contain"
                              />
                            ) : null}
                          </div>
                        );
                      })}
                  </div>
                )}

                <img
                  src={selectedBusImage}
                  alt={`ภาพรถ - ${selectedLabel}`}
                  className="h-48 w-auto object-contain select-none"
                  decoding="async"
                  loading="eager"
                />
              </div>
            </HeroWithShadow>
          ) : (
            <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">
              Bus image preview (ภาพสำหรับรุ่นนี้จะถูกเพิ่มภายหลัง)
            </div>
          )}
          <p className="mt-1 font-prompt font-semibold text-[#001a73] text-center">
            รถที่ใช้งาน : {selectedLabel}
          </p>
        </div>
        <div className="bg-white rounded-2xl -mt-2 p-4 border border-gray-400">
          <StepTabs active={3} />

          <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">
            ความสะดวกสบาย
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
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
