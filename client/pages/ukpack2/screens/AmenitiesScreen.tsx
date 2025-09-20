import React, { useEffect, useState } from "react";
import CustomizationScreen from "../components/CustomizationScreen";
import ConfirmModal from "../components/ConfirmModal";
import SelectionCard from "../components/SelectionCard";
import CtaButton from "../components/CtaButton";

const IconAir = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F717ae5876456493a97f29b6d6684c104?format=webp&width=800"
    alt="แอร์"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconAirAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff0fe8436ac954fd6b49da127a89b7d76?format=webp&width=800"
    alt="แอร์ (ก��แล้ว)"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconFan = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F891faed3bf8a457fbcdd936181ed2b7a?format=webp&width=800"
    alt="พัด�����"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconFanAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F280e585e2bdc4134acc70eeb143c6c69?format=webp&width=800"
    alt="พัดลม (กดแล้ว)"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconSeat = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F54f4c944e6ab4e84800e14b2a1105b94?format=webp&width=800"
    alt="หน้าต่างเปิดได้"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconSeatAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb486238ba25f4078a86915b3db2688eb?format=webp&width=800"
    alt="หน้าต่างเปิดได้ (กดแล้ว)"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconWifi = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdfbb7f3adfa04596916b9ea1950acef1?format=webp&width=800"
    alt="ที่จับ/ราวยืน"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconWifiAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F70d82d5dddd54c909edc9bddb202fc6e?format=webp&width=800"
    alt="ที่จับ/ราวยืน (กดแล้ว)"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconPlug = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fae1e15679ac4476a9e82f163e7eab121?format=webp&width=800"
    alt="ช่องชาร์จมือถือ/USB"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconPlugAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F76d2422a6fb84d0bb752cd149518a87b?format=webp&width=800"
    alt="ช่องชาร์จมือถือ/USB (กดแล้ว)"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconTv = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1fb83749171e40fdb6fd8e6d75d46504?format=webp&width=800"
    alt="Wi‑Fi ฟรี"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconTvAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F6e2f3a1c18de4c0187b9cd255fbf38a7?format=webp&width=800"
    alt="Wi‑Fi ฟรี (กดแล้ว)"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconCup = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F48d62d5384e148bf8fe718dd2287d55f?format=webp&width=800"
    alt="ระบบประกาศบอกป้าย(เสียง/จอ)"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconCupAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F2c2b4af39249468d92e4252d584cf2fd?format=webp&width=800"
    alt="ระบบประกาศบอกป้าย(กดแล้ว)"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);

const AMENITIES = [
  { key: "air", label: "แอร์", icon: <IconAir />, iconActive: <IconAirAlt /> },
  { key: "fan", label: "พัดลม", icon: <IconFan />, iconActive: <IconFanAlt /> },
  { key: "seat", label: "ที่นั่งพิเศษ", icon: <IconSeat />, iconActive: <IconSeatAlt /> },
  { key: "wifi", label: "ที่จับ/ราวยืนที่ปลอดภัย", icon: <IconWifi />, iconActive: <IconWifiAlt /> },
  { key: "plug", label: "ช่องชาร์จมือถือ/USB", icon: <IconPlug />, iconActive: <IconPlugAlt /> },
  { key: "tv", label: "Wi‑Fi ฟรี", icon: <IconTv />, iconActive: <IconTvAlt /> },
  { key: "cup", label: "ระบบประกาศบอกป้าย(เสียง/จอ)", icon: <IconCup />, iconActive: <IconCupAlt /> },
];

import { useNavigate } from "react-router-dom";
import StepTabs from "../components/StepTabs";
import VehiclePreview from "../components/VehiclePreview";
import styles from "./chassis.module.css";
import { useBusDesign } from "../context/BusDesignContext";

const AmenitiesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useBusDesign();
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
    medium: "รถเมล์มาตรฐาน 30–50 ��ี่นั่ง",
    large: "รถตู้โดยสาร 9–15 ที่นั่ง",
    extra: "รถกะบะดัดแปลง 8–12 ที่นั่ง",
  };
  const HERO_IMAGE: Record<string, string> = {
    small:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F20092528ba1e4f2eb4562515ccb6f75a?format=webp&width=800",
    medium:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbcd1013232914b39b73ebd2bd35d7bbd?format=webp&width=800",
    large:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F297c5816ab8c4adeb3cc73b6f66ab9e0?format=webp&width=800",
    extra:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8b4be3122d774f95b4c5e5bde1cd7c49?format=webp&width=800",
  };
  const selectedChassis = (() => {
    try {
      // prefer value from context state, fallback to sessionStorage
      const ctx = state?.chassis;
      if (ctx) return ctx as keyof typeof CHASSIS_LABELS;
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
    แอร์: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F43ef2946e5324cb981bc063db02fe5bc?format=webp&width=800",
    พัดลม:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4e8932e864664a7f8a454d61f4e87ca9?format=webp&width=800",
    ที่นั่งพิเศษ:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F788c9e78d6944fc8a5088cc00aa40697?format=webp&width=800", // ใช้ไอคอนหน้าต่างเปิดได้
    หน้าต่างเปิดได้:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F788c9e78d6944fc8a5088cc00aa40697?format=webp&width=800",
    "ที่จับ/ราวยืนที่ปลอดภัย":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1cae4f7306834a6eb0d86be09e05bfdd?format=webp&width=800",
    "ช่องชาร์จมือถือ/USB":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fba274e72720c4a1b9695e83dbf8c1fe9?format=webp&width=800",
    "Wi‑Fi ฟรี":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4ac1a198d950430b9ad73c0cba9c7fd6?format=webp&width=800",
    "ระบบประกาศบอกป้าย(เสียง/จอ)":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8cb34953cb154a96b61c6c6a5352056c?format=webp&width=800",
    // keys (fallback)
    air: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F43ef2946e5324cb981bc063db02fe5bc?format=webp&width=800",
    fan: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4e8932e864664a7f8a454d61f4e87ca9?format=webp&width=800",
    seat: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F788c9e78d6944fc8a5088cc00aa40697?format=webp&width=800",
    wifi: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1cae4f7306834a6eb0d86be09e05bfdd?format=webp&width=800",
    plug: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fba274e72720c4a1b9695e83dbf8c1fe9?format=webp&width=800",
    tv: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4ac1a198d950430b9ad73c0cba9c7fd6?format=webp&width=800",
    cup: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8cb34953cb154a96b61c6c6a5352056c?format=webp&width=800",
  };

  return (
    <CustomizationScreen
      title="ปรับแต��งรถเมล์ของ���ุณ"
      theme="light"
      fullWidth
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
                colorFilter={null}
                colorHex={null}
                label={selectedLabel}
                showSelectedText
                overlayLabels={selected
                  .slice()
                  .filter((l) => AMENITIES.some((a) => a.label === l))
                  .sort((a, b) => a.localeCompare(b, "th"))}
                overlayIconMap={OVERLAY_ICON_SRC}
              />
            ) : (
              <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">
                Bus image preview (ภาพสำหรับรุ่นนี้จะ��ูกเพิ่มภายหลัง)
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AMENITIES.map((a) => (
                  <SelectionCard
                    key={a.key}
                    icon={selected.includes(a.label) ? (a.iconActive || a.icon) : a.icon}
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
