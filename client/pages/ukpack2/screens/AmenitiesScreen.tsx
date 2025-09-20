import React, { useEffect, useState } from "react";
import CustomizationScreen from "../components/CustomizationScreen";
import ConfirmModal from "../components/ConfirmModal";
import SelectionCard from "../components/SelectionCard";
import CtaButton from "../components/CtaButton";

const IconAir = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1af05f2540e4401ea9f82f3082f1262d?format=webp&width=800"
    alt="แอร์"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconFan = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F73e1aae278224ef5861c3f19966cd63b?format=webp&width=800"
    alt="พัดลม"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconSeat = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F93439b2533284cdf914fc93cafa1cf26?format=webp&width=800"
    alt="หน้าต่างเปิดได้"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconWifi = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F3a949d75d90840669601df07a65af479?format=webp&width=800"
    alt="ที่จับ/ราวยืน"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconPlug = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F69ce70e36cc043d2b124a20e34d33b06?format=webp&width=800"
    alt="ช่องชาร์จมือถือ/USB"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconTv = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F6e87ff91650a4c828cd5286cfaa34bb7?format=webp&width=800"
    alt="Wi‑Fi ฟรี"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconCup = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F303a12b36a7b4bfb99c7707bbe96b8a6?format=webp&width=800"
    alt="ระบบประกาศบอกป้าย(เสียง/จอ)"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);

const AMENITIES = [
  { key: "air", label: "แอร์", icon: <IconAir /> },
  { key: "fan", label: "พัดลม", icon: <IconFan /> },
  { key: "seat", label: "ที่นั่งพิเศษ", icon: <IconSeat /> },
  { key: "wifi", label: "ที่จับ/��าวยืนที่ปลอดภัย", icon: <IconWifi /> },
  { key: "plug", label: "ช่องชาร์จมือถือ/USB", icon: <IconPlug /> },
  { key: "tv", label: "Wi‑Fi ฟรี", icon: <IconTv /> },
  { key: "cup", label: "ระบบประกาศบอกป้าย(เสียง/จอ)", icon: <IconCup /> },
];

import { useNavigate } from "react-router-dom";
import StepTabs from "../components/StepTabs";
import VehiclePreview from "../components/VehiclePreview";
import styles from "./chassis.module.css";

const AmenitiesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(["แอร์"]);
  // load previously selected amenities
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("design.amenities");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setSelected(arr);
      }
    } catch {}
  }, []);

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
    medium: "รถเมล์มาตรฐาน 30–50 ที่นั่ง",
    large: "รถตู้โดยสาร 9–15 ที่นั่ง",
    extra: "รถกะบะดัดแปลง 8–12 ที่นั่ง",
  };
  const HERO_IMAGE: Record<string, string> = {
    small:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5ea1b3d990e44d49aa5441bc3a4b3bcc?format=webp&width=800",
    medium:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fab8ddd78f9a0478bb27f5818928665f3?format=webp&width=800",
    large:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc4ba360c1fe64492b71fc207c9dfd328?format=webp&width=800",
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

  const storedColor = (() => {
    try {
      const raw = sessionStorage.getItem("design.color");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

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
      fullWidth
      containerPaddingClass={styles.containerPadding}
      footerContent={
        <div className="flex justify-center">
          <CtaButton text="ถัดไป" onClick={handleNext} />
        </div>
      }
    >
      <div className={styles.contentGrid}>
        <div className={`${styles.previewWrapper}`}>
          <div className={styles.previewInner}>
            {selectedBusImage ? (
              <VehiclePreview
                imageSrc={selectedBusImage}
                colorFilter={storedColor?.filter}
                label={
                  <>
                    <p className="mb-0">รถที่เลือก :</p>
                    {selectedLabel}
                  </>
                }
                overlayLabels={selected
                  .slice()
                  .filter((l) => AMENITIES.some((a) => a.label === l))
                  .sort((a, b) => a.localeCompare(b, "th"))}
                overlayIconMap={OVERLAY_ICON_SRC}
              />
            ) : (
              <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">
                Bus image preview (ภาพสำหรับรุ่นนี้จะถูกเพิ่มภายหลัง)
              </div>
            )}
          </div>
        </div>

        <section className={`${styles.controlsSection} ${styles.controlsWrapper}`}>
          <div className={styles.tabsWrapper}>
            <StepTabs active={3} />
          </div>

          <div className={styles.controlsBox}>
            <div className={styles.controlsContent}>
              <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">
                ความสะดวกสบาย
              </h2>

              <div className={styles.selectionGrid}>
                {AMENITIES.map((a) => (
                  <SelectionCard
                    key={a.key}
                    icon={a.icon}
                    label={a.label}
                    isSelected={selected.includes(a.label)}
                    onClick={() => toggle(a.label)}
                    variant="light"
                    hideLabel
                    appearance="group"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </CustomizationScreen>
  );
};

export default AmenitiesScreen;
