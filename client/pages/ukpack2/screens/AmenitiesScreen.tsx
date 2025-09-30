import React, { useEffect, useState } from "react";
import CustomizationScreen from "../components/CustomizationScreen";
import ConfirmModal from "../components/ConfirmModal";
import SelectionCard from "../components/SelectionCard";
import CtaButton from "../components/CtaButton";
import { HERO_IMAGE, CHASSIS_LABELS } from "../utils/heroImages";
import MyFooter from "../mydreambus/components/MyFooter";

const IconAir = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F717ae5876456493a97f29b6d6684c104?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconAirAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff0fe8436ac954fd6b49da127a89b7d76?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconFan = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F891faed3bf8a457fbcdd936181ed2b7a?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconFanAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F280e585e2bdc4134acc70eeb143c6c69?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconSeat = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F54f4c944e6ab4e84800e14b2a1105b94?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconSeatAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb486238ba25f4078a86915b3db2688eb?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconWifi = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdfbb7f3adfa04596916b9ea1950acef1?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconWifiAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F70d82d5dddd54c909edc9bddb202fc6e?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconPlug = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fae1e15679ac4476a9e82f163e7eab121?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconPlugAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F76d2422a6fb84d0bb752cd149518a87b?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconTv = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1fb83749171e40fdb6fd8e6d75d46504?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconTvAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F6e2f3a1c18de4c0187b9cd255fbf38a7?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconCup = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F48d62d5384e148bf8fe718dd2287d55f?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);
const IconCupAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F2c2b4af39249468d92e4252d584cf2fd?format=webp&width=800"
    alt="image"
    className="object-contain select-none h-full w-full"
    decoding="async"
    loading="eager"
  />
);

const AMENITIES = [
  { key: "air", label: "แอร์", icon: <IconAir />, iconActive: <IconAirAlt /> },
  { key: "fan", label: "พัดลม", icon: <IconFan />, iconActive: <IconFanAlt /> },
  {
    key: "seat",
    label: "ที่นั่งพิเศษ",
    icon: <IconSeat />,
    iconActive: <IconSeatAlt />,
  },
  {
    key: "wifi",
    label: "ที่จับ/ราวยืนที่ปลอดภัย",
    icon: <IconWifi />,
    iconActive: <IconWifiAlt />,
  },
  {
    key: "plug",
    label: "ช่องชาร์จมือถือ/USB",
    icon: <IconPlug />,
    iconActive: <IconPlugAlt />,
  },
  {
    key: "tv",
    label: "Wi‑Fi ฟรี",
    icon: <IconTv />,
    iconActive: <IconTvAlt />,
  },
  {
    key: "cup",
    label: "ระบบประกาศบอกป้าย(เสียง/จอ)",
    icon: <IconCup />,
    iconActive: <IconCupAlt />,
  },
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

  const AMENITIES_BUTTON_SRC: Record<string, string> = {
    แอร์: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F717ae5876456493a97f29b6d6684c104?format=webp&width=800",
    พัดลม:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F891faed3bf8a457fbcdd936181ed2b7a?format=webp&width=800",
    ที่นั่งพิเศษ:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F54f4c944e6ab4e84800e14b2a1105b94?format=webp&width=800",
    "ที่จับ/ราวยืนที่ปลอดภัย":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdfbb7f3adfa04596916b9ea1950acef1?format=webp&width=800",
    "ช่องชาร์จมือถือ/USB":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fae1e15679ac4476a9e82f163e7eab121?format=webp&width=800",
    "Wi‑Fi ฟรี":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1fb83749171e40fdb6fd8e6d75d46504?format=webp&width=800",
    "ระบบประกาศบอกป้าย(เสียง/จอ)":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F48d62d5384e148bf8fe718dd2287d55f?format=webp&width=800",
  };

  const handleNext = () => {
    try {
      sessionStorage.setItem("design.amenities", JSON.stringify(selected));
      // persist overlay icon mapping for selected amenities so other pages use
      // the exact asset used in the selection buttons
      try {
        const raw = sessionStorage.getItem("design.overlayIconMap");
        const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
        selected.forEach((lab) => {
          if (OVERLAY_ICON_SRC[lab]) map[lab] = OVERLAY_ICON_SRC[lab];
        });
        sessionStorage.setItem("design.overlayIconMap", JSON.stringify(map));
      } catch (e) {
        // ignore
      }
    } catch (e) {}
    navigate("/mydreambus/payment");
  };

  // Selected chassis preview (reusing mapping from SeatingScreen)
  const selectedChassis = (() => {
    try {
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
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb35efe05833149089a2df21cf61300b4?format=webp&width=800", // ใช้ไอคอนหน้าต่างเปิดได้
    หน้าต่างเปิดได้:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb35efe05833149089a2df21cf61300b4?format=webp&width=800",
    "ที่จับ/ราวยืนที่ปลอดภัย":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fa9c2a350877e46c3a49f0f6cd867ae99?format=webp&width=800",
    "ช่องชาร์จมือถือ/USB":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F2d38a737cf2c4bf29f8764e48a93d404?format=webp&width=800",
    "Wi‑Fi ฟรี":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F3704368ab32542b7a31e3eba186adc57?format=webp&width=800",
    "ระบบประ���าศบอกป้าย (เสียง/จอ)":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F0623bd2f3e75452cbf76a828b416d275?format=webp&width=800",
    // keys (fallback)
    air: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F43ef2946e5324cb981bc063db02fe5bc?format=webp&width=800",
    fan: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4e8932e864664a7f8a454d61f4e87ca9?format=webp&width=800",
    seat: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb35efe05833149089a2df21cf61300b4?format=webp&width=800",
    wifi: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fa9c2a350877e46c3a49f0f6cd867ae99?format=webp&width=800",
    plug: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F2d38a737cf2c4bf29f8764e48a93d404?format=webp&width=800",
    tv: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F3704368ab32542b7a31e3eba186adc57?format=webp&width=800",
    cup: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F0623bd2f3e75452cbf76a828b416d275?format=webp&width=800",
  };

  return (
    <CustomizationScreen
      title="อ���กแบบรถเมล์ของคุณ"
      theme="light"
      fullWidth
      footerContent={
        <Uk2Footer>
          <div className="w-full flex justify-center">
            <CtaButton text="ถัดไป" onClick={handleNext} />
          </div>
        </Uk2Footer>
      }
    >
      <div className={styles.contentGrid}>
        <div className={`${styles.previewWrapper}`}>
          <div className={styles.previewInner}>
            {selectedBusImage ? (
              <VehiclePreview
                imageSrc={selectedBusImage}
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
                Bus image preview (ภาพสำหรับรุ่นนี้จะถูกเพิ่มภายหลัง)
              </div>
            )}
          </div>
        </div>

        <section
          className={`${styles.controlsSection} ${styles.controlsWrapper}`}
        >
          <div className={styles.tabsWrapper}>
            <StepTabs active={3} />
          </div>

          <div className={styles.controlsBox}>
            <div className={styles.controlsContent}>
              <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">
                ความสะดวกสบาย
              </h2>

              <div className="grid grid-cols-4 gap-3">
                {AMENITIES.map((a) => (
                  <SelectionCard
                    key={a.key}
                    icon={
                      selected.includes(a.label)
                        ? a.iconActive || a.icon
                        : a.icon
                    }
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
