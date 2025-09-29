import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SelectionCard from "../components/SelectionCard";
import VehiclePreview from "../components/VehiclePreview";
import CtaButton from "../components/CtaButton";
import StepTabs from "../components/StepTabs";
import styles from "./chassis.module.css";
import { useBusDesign } from "../context/BusDesignContext";
import { OVERLAY_ICON_SRC } from "../utils/overlayIcons";
import ErrorModal from "../components/ErrorModal";
import Uk2Footer from "../components/Uk2Footer";
import { HERO_IMAGE, CHASSIS_LABELS } from "../utils/heroImages";

// Amenity icons (small versions)
const IconAir = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fee1c18a935564e92bb49991fac3b76df?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconFan = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe01792ee89e240808ed47d8576b55d71?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconSeat = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F93439b2533284cdf914fc93cafa1cf26?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconWifi = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb0789bfd1100472f8351704764607d31?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconPlug = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F09a78e31a3de44e98772b0eef382af6f?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconTv = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcb0cbf9ef6764e2d9e6f06e87827f5e9?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconCup = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe903bdf27bab4175824c159bc19a02ba?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconCamSmall = () => (
  <svg
    width="18"
    height="18"
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

const AMENITIES_ICON_MAP: Record<string, JSX.Element> = {
  แอร์: <IconAir />,
  พัดลม: <IconFan />,
  ที่นั่งพิเศษ: <IconSeat />,
  "ที่จับ/ราวยืนที่ปลอดภัย": <IconWifi />,
  "ช่องชาร์จ���ือถือ/USB": <IconPlug />,
  "Wi‑Fi ฟรี": <IconTv />,
  "ระบบประกาศบอกป้าย(เสียง/จอ)": <IconCup />,
  กล้องวงจรปิด: <IconCamSmall />,
};

const MONEY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbc8b22cedfbb4640a702f724881f196d?format=webp&width=800";
const SCAN_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb8992da4be824b339d3df5f0a076ed93?format=webp&width=800";
const SCAN2_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F56620e798eb94153b2390271f30d0dae?format=webp&width=800";
const TOUCH_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdb2e47a586b841d1af014e9196f3c411?format=webp&width=800";
const MONTHLY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fca6467eff0c74a77a8e5757f25a24e41?format=webp&width=800";
const BUS_EMPLOY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F41c089c5dd4b448993c4e02c02cdf7ac?format=webp&width=800";

const storedColor = (() => {
  try {
    const raw = sessionStorage.getItem("design.color");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const IconDoor1 = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbfe398b713cf4650810c0e346f6c03e3?format=webp&width=800"
    alt="image"
    className="object-contain select-none max-h-full w-auto"
    decoding="async"
    loading="eager"
  />
);

const IconDoor1Active = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F98d04b20f971412fb6a7d60950f0e4c9?format=webp&width=800"
    alt="image"
    className="object-contain select-none max-h-full w-auto"
    decoding="async"
    loading="eager"
  />
);
const IconDoor2 = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faee46c4c7271461dadfd68c9eb3aec69?format=webp&width=800"
    alt="image"
    className="object-contain select-none max-h-full w-auto"
    decoding="async"
    loading="eager"
  />
);

const IconDoor2Active = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F0b451e5d181749a3859f155297f384b3?format=webp&width=800"
    alt="image"
    className="object-contain select-none max-h-full w-auto"
    decoding="async"
    loading="eager"
  />
);
const IconRamp = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fa302e10e3ba84cc4ba5effbc28a5a34e?format=webp&width=800"
    alt="image"
    className="object-contain select-none max-h-full w-auto"
    decoding="async"
    loading="eager"
  />
);

const IconRampActive = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8780c6420dd24e34acb822419b5e4086?format=webp&width=800"
    alt="image"
    className="object-contain select-none max-h-full w-auto"
    decoding="async"
    loading="eager"
  />
);
const IconHighLow = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcc69b8718f934fbb8059e036ca6cb93f?format=webp&width=800"
    alt="image"
    className="object-contain select-none max-h-full w-auto"
    decoding="async"
    loading="eager"
  />
);

const IconHighLowActive = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F7751b75a4009449a97a5cce2d8b9d0f6?format=webp&width=800"
    alt="image"
    className="object-contain select-none max-h-full w-auto"
    decoding="async"
    loading="eager"
  />
);

const DoorScreen: React.FC = () => {
  const navigate = useNavigate();
  type DoorSelection = {
    doorChoice: string | null;
    hasRamp: boolean;
    highLow: boolean;
  };
  const [selectedOption, setSelectedOption] = useState<DoorSelection>(() => {
    try {
      const raw = sessionStorage.getItem("design.doors");
      if (!raw) return { doorChoice: "1", hasRamp: false, highLow: false };
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string")
        return { doorChoice: parsed, hasRamp: false, highLow: false };
      if (parsed && typeof parsed === "object") {
        return {
          doorChoice:
            parsed.doorChoice ?? (typeof parsed === "string" ? parsed : null),
          hasRamp: Boolean(parsed.hasRamp),
          highLow: Boolean(parsed.highLow),
        } as DoorSelection;
      }
    } catch (e) {
      // ignore
    }
    return { doorChoice: "1", hasRamp: false, highLow: false };
  });

  const DOOR_BUTTON_SRC: Record<string, string> = {
    "1": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbfe398b713cf4650810c0e346f6c03e3?format=webp&width=800",
    "2": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faee46c4c7271461dadfd68c9eb3aec69?format=webp&width=800",
    ramp: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F245ff72a7c3b468293c517a934e4e839?format=webp&width=800",
    emergency:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcc69b8718f934fbb8059e036ca6cb93f?format=webp&width=800",
  };

  // Previously we removed door keys from overlayIconMap here;
  // keep overlayIconMap intact so door clicks can add/remove overlays as requested.
  useEffect(() => {}, []);

  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNext = () => {
    try {
      // store door selection object
      const payload = {
        doorChoice: selectedOption.doorChoice,
        hasRamp: selectedOption.hasRamp,
        highLow: selectedOption.highLow,
      };
      sessionStorage.setItem("design.doors", JSON.stringify(payload));
      // NOTE: Do NOT persist overlay icon for door selection here — door clicks must not write overlay mappings
      // (overlayIconMap is left unchanged by this screen)
    } catch (e) {}
    navigate("/mydreambus/design");
  };

  return (
    <>
      <CustomizationScreen
        title="ปรับแต่งรถเมล์ของคุณ"
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
          <div className="w-full rounded-md flex flex-col items-center justify-center gap-2">
            {(() => {
              let selected = "medium";
              try {
                const saved = sessionStorage.getItem("design.chassis");
                if (saved) selected = saved;
              } catch (e) {}
              const label = CHASSIS_LABELS[selected] || "";
              const img = HERO_IMAGE[selected];

              // read previous selections
              const amenitiesFromStorage = (() => {
                try {
                  const raw = sessionStorage.getItem("design.amenities");
                  return raw ? (JSON.parse(raw) as string[]) : [];
                } catch {
                  return [] as string[];
                }
              })();
              const paymentsFromStorage = (() => {
                try {
                  const raw = sessionStorage.getItem("design.payment");
                  return raw ? (JSON.parse(raw) as string[]) : [];
                } catch {
                  return [] as string[];
                }
              })();

              // build overlay labels: amenities + payments + current door selection
              const overlayLabels = [
                ...(amenitiesFromStorage || []),
                ...(paymentsFromStorage || []),
              ];
              // Include current door selections so clicked door icons show as overlays
              if (selectedOption.doorChoice)
                overlayLabels.push(selectedOption.doorChoice);
              if (selectedOption.hasRamp) overlayLabels.push("ramp");
              if (selectedOption.highLow) overlayLabels.push("emergency");

              const renderOverlayIcon = (label: string, idx: number) => {
                // amenities
                if (AMENITIES_ICON_MAP[label]) {
                  return (
                    <div
                      key={`${label}-${idx}`}
                      className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                    >
                      {AMENITIES_ICON_MAP[label]}
                    </div>
                  );
                }

                // payment labels
                if (label === "เงิน���ด")
                  return (
                    <div
                      key={`${label}-${idx}`}
                      className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                    >
                      <img
                        src={MONEY_ICON}
                        alt={label}
                        className="h-5 w-5 object-contain"
                      />
                    </div>
                  );
                if (label === "สแกนจ่าย")
                  return (
                    <div
                      key={`${label}-${idx}`}
                      className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                    >
                      <img
                        src={SCAN_ICON}
                        alt={label}
                        className="h-5 w-5 object-contain"
                      />
                    </div>
                  );
                if (label === "ตู้อัตโนมัติ")
                  return (
                    <div
                      key={`${label}-${idx}`}
                      className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                    >
                      <img
                        src={SCAN2_ICON}
                        alt={label}
                        className="h-5 w-5 object-contain"
                      />
                    </div>
                  );
                if (label === "แตะบัตร")
                  return (
                    <div
                      key={`${label}-${idx}`}
                      className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                    >
                      <img
                        src={TOUCH_ICON}
                        alt={label}
                        className="h-5 w-5 object-contain"
                      />
                    </div>
                  );
                if (label === "กระเป๋ารถเมล์")
                  return (
                    <div
                      key={`${label}-${idx}`}
                      className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                    >
                      <img
                        src={BUS_EMPLOY_ICON}
                        alt={label}
                        className="h-5 w-5 object-contain"
                      />
                    </div>
                  );
                if (label === "ตั๋วรายเดือน/รอบ")
                  return (
                    <div
                      key={`${label}-${idx}`}
                      className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                    >
                      <img
                        src={MONTHLY_ICON}
                        alt={label}
                        className="h-5 w-5 object-contain"
                      />
                    </div>
                  );

                // door option keys
                if (label === "1")
                  return (
                    <div
                      key={`${label}-${idx}`}
                      className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                    >
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbfe398b713cf4650810c0e346f6c03e3?format=webp&width=800"
                        alt="image"
                        className="h-6 w-6 md:h-7 md:w-7 object-contain"
                      />
                    </div>
                  );
                if (label === "2")
                  return (
                    <div
                      key={`${label}-${idx}`}
                      className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                    >
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8f9b21942af243b3b80b0e5ac8b12631?format=webp&width=800"
                        alt="image"
                        className="h-6 w-6 md:h-7 md:w-7 object-contain"
                      />
                    </div>
                  );
                if (label === "ramp")
                  return (
                    <div
                      key={`${label}-${idx}`}
                      className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                    >
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fece2b6fc843340f0997f2fd7d3ca0aea?format=webp&width=800"
                        alt="image"
                        className="h-6 w-6 md:h-7 md:w-7 object-contain"
                      />
                    </div>
                  );
                if (label === "emergency")
                  return (
                    <div
                      key={`${label}-${idx}`}
                      className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                    >
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F98de0624be3d4ae6b96d83edcf8891f9?format=webp&width=800"
                        alt="image"
                        className="h-6 w-6 md:h-7 md:w-7 object-contain"
                      />
                    </div>
                  );

                return (
                  <div
                    key={`${label}-${idx}`}
                    className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10 text-xs"
                  >
                    ?
                  </div>
                );
              };

              return img ? (
                <>
                  {(() => {
                    // Build a robust merged overlay map that includes normalized keys and fallbacks
                    let storedMapRaw: Record<string, string> = {};
                    try {
                      const raw = sessionStorage.getItem(
                        "design.overlayIconMap",
                      );
                      if (raw)
                        storedMapRaw = JSON.parse(raw) as Record<
                          string,
                          string
                        >;
                    } catch {}

                    const normalizeKey = (s: string) =>
                      (s || "")
                        .replace(/\uFFFD/g, "")
                        .replace(/\u2011/g, "-")
                        .replace(/\u00A0/g, " ")
                        .replace(/&amp;/g, "&")
                        .replace(/\s+/g, " ")
                        .trim()
                        .toLowerCase();

                    const merged: Record<string, string | React.ReactNode> = {};

                    // Helper to set multiple variants
                    const setVariants = (
                      key: string,
                      val: string | React.ReactNode,
                    ) => {
                      merged[key] = val;
                      try {
                        const nk = normalizeKey(key);
                        if (nk) merged[nk] = val;
                        const nkNoSpace = nk.replace(/\s/g, "");
                        if (nkNoSpace) merged[nkNoSpace] = val;
                      } catch {}
                    };

                    // Favor storedMapRaw entries (URLs)
                    for (const k of Object.keys(storedMapRaw)) {
                      setVariants(k, storedMapRaw[k]);
                    }

                    // Then overlay constants
                    for (const k of Object.keys(OVERLAY_ICON_SRC)) {
                      if (!merged[k]) setVariants(k, OVERLAY_ICON_SRC[k]);
                    }

                    // Then amenities small JSX nodes as fallback
                    for (const k of Object.keys(AMENITIES_ICON_MAP)) {
                      if (!merged[k]) setVariants(k, AMENITIES_ICON_MAP[k]);
                    }

                    // Ensure explicit keys exist
                    const explicit = [
                      "เงินสด",
                      "สแกนจ่าย",
                      "ตู้อัตโนมัติ",
                      "แตะบัตร",
                      "กระเป๋ารถเมล์",
                      "ต��๋วรายเดือน/รอบ",
                      "1",
                      "2",
                      "ramp",
                      "emergency",
                    ];
                    for (const k of explicit) {
                      if (!merged[k]) {
                        if (storedMapRaw[k]) setVariants(k, storedMapRaw[k]);
                        else if (OVERLAY_ICON_SRC[k])
                          setVariants(k, OVERLAY_ICON_SRC[k]);
                        else if (AMENITIES_ICON_MAP[k])
                          setVariants(k, AMENITIES_ICON_MAP[k]);
                      }
                    }

                    return (
                      <VehiclePreview
                        imageSrc={img}
                        label={label}
                        showSelectedText
                        overlayLabels={overlayLabels}
                        overlayIconMap={merged}
                      />
                    );
                  })()}
                </>
              ) : (
                <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">
                  Bus image preview
                </div>
              );
            })()}
          </div>
          <section
            className={`${styles.controlsSection} ${styles.controlsWrapper} ${styles.doorControls}`}
          >
            <div className={styles.tabsWrapper}>
              <StepTabs active={5} />
            </div>

            <div className={styles.controlsBox}>
              <div className={styles.controlsContent}>
                <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">
                  เลือกทางขึ้น-ลง หลัก
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(() => {
                    const DOOR_OPTIONS = [
                      {
                        key: "1",
                        label: "1 ประตู",
                        icon: <IconDoor1 />,
                        iconActive: <IconDoor1Active />,
                      },
                      {
                        key: "2",
                        label: "2 ประตู",
                        icon: <IconDoor2 />,
                        iconActive: <IconDoor2Active />,
                      },
                      {
                        key: "ramp",
                        label: "ทางลาดสำหรับรถเข็น/ผู้พิการ",
                        icon: <IconRamp />,
                        iconActive: <IconRampActive />,
                      },
                      {
                        key: "emergency",
                        label: "ประตูฉุกเฉิน",
                        icon: <IconHighLow />,
                        iconActive: <IconHighLowActive />,
                      },
                    ];

                    // helper to normalize and set variants into overlayIconMap in sessionStorage
                    const normalizeKey = (s: string) =>
                      (s || "")
                        .replace(/\uFFFD/g, "")
                        .replace(/\u2011/g, "-")
                        .replace(/\u00A0/g, " ")
                        .replace(/&amp;/g, "&")
                        .replace(/\s+/g, " ")
                        .trim()
                        .toLowerCase();

                    const loadStoredMap = () => {
                      try {
                        const raw = sessionStorage.getItem(
                          "design.overlayIconMap",
                        );
                        return raw
                          ? (JSON.parse(raw) as Record<string, string>)
                          : {};
                      } catch {
                        return {} as Record<string, string>;
                      }
                    };

                    const setVariantsToStorage = (
                      map: Record<string, string>,
                      key: string,
                      val: string,
                    ) => {
                      try {
                        map[key] = val;
                        const nk = normalizeKey(key);
                        if (nk) map[nk] = val;
                        const nkNoSpace = nk.replace(/\s/g, "");
                        if (nkNoSpace) map[nkNoSpace] = val;
                      } catch (e) {
                        // ignore
                      }
                    };

                    const handleSelect = (opt: any) => {
                      // Multi-select rules:
                      // - '1' and '2' are mutually exclusive (only one doorChoice)
                      // - 'ramp' and 'emergency' are independent and can both be selected
                      // - maximum of 3 selections total
                      const current = selectedOption;
                      let newSelection = { ...current } as DoorSelection;

                      if (opt.key === "1" || opt.key === "2") {
                        // toggle doorChoice
                        if (current.doorChoice === opt.key)
                          newSelection.doorChoice = null;
                        else newSelection.doorChoice = opt.key;
                      } else if (opt.key === "ramp") {
                        newSelection.hasRamp = !current.hasRamp;
                      } else if (opt.key === "emergency") {
                        newSelection.highLow = !current.highLow;
                      }

                      const newCount =
                        (newSelection.doorChoice ? 1 : 0) +
                        (newSelection.hasRamp ? 1 : 0) +
                        (newSelection.highLow ? 1 : 0);

                      if (newCount > 3) {
                        setErrorMessage(
                          "สามารถเลือกได้สูงสุด 3 รายการเท่านั้น",
                        );
                        setErrorModalOpen(true);
                        return;
                      }

                      // Persist selection state
                      setSelectedOption(newSelection);

                      // Update overlayIconMap in sessionStorage so clicked door icons appear as overlays
                      try {
                        const map = loadStoredMap();

                        const candidateForKey = (
                          key: string,
                          label?: string,
                        ) => {
                          // lookup in stored map first
                          if (map[key]) return map[key];
                          const nk = normalizeKey(key);
                          for (const k of Object.keys(map)) {
                            if (normalizeKey(k) === nk) return map[k];
                          }
                          // fallback to DOOR_BUTTON_SRC
                          if (DOOR_BUTTON_SRC[key]) return DOOR_BUTTON_SRC[key];
                          if (label && DOOR_BUTTON_SRC[label])
                            return DOOR_BUTTON_SRC[label];
                          return undefined;
                        };

                        const setOrRemove = (
                          key: string,
                          shouldSet: boolean,
                        ) => {
                          try {
                            if (shouldSet) {
                              const val = candidateForKey(key);
                              if (val) setVariantsToStorage(map, key, val);
                            } else {
                              // remove variants
                              try {
                                if (map[key]) delete map[key];
                                const nk = normalizeKey(key);
                                if (map[nk]) delete map[nk];
                                const nkNoSpace = nk.replace(/\s/g, "");
                                if (map[nkNoSpace]) delete map[nkNoSpace];
                              } catch (e) {}
                            }
                          } catch (e) {
                            // ignore
                          }
                        };

                        // apply for each possible door key
                        // doorChoice
                        setOrRemove("1", newSelection.doorChoice === "1");
                        setOrRemove("2", newSelection.doorChoice === "2");
                        // ramp / emergency
                        setOrRemove("ramp", Boolean(newSelection.hasRamp));
                        setOrRemove("emergency", Boolean(newSelection.highLow));

                        sessionStorage.setItem(
                          "design.overlayIconMap",
                          JSON.stringify(map),
                        );
                      } catch (e) {
                        // ignore overlay save errors
                      }
                    };

                    {
                      const nodes: React.ReactNode[] = [];
                      DOOR_OPTIONS.forEach((opt, idx) => {
                        // determine if two-door should be disabled when chassis is the large van
                        let disabled = false;
                        try {
                          const savedChassis = (() => {
                            try {
                              const raw = sessionStorage.getItem("design.chassis");
                              return raw ? raw : "";
                            } catch {
                              return "";
                            }
                          })();
                          // 'large' maps to รถตู้โดยสาร 9-15 ที่นั่ง — disable 2-door for this chassis
                          if (savedChassis === "large" && opt.key === "2") disabled = true;
                        } catch (e) {}
                        // try to use stored overlay URL if available (by key or label)
                        let storedMap: Record<string, string | null> = {};
                        try {
                          const raw = sessionStorage.getItem(
                            "design.overlayIconMap",
                          );
                          if (raw)
                            storedMap = JSON.parse(raw) as Record<
                              string,
                              string
                            >;
                        } catch {}

                        const lookupStored = (labelOrKey: string) => {
                          if (!labelOrKey) return undefined;
                          if (storedMap[labelOrKey])
                            return storedMap[labelOrKey] as string;
                          const target = normalizeKey(labelOrKey);
                          for (const k of Object.keys(storedMap)) {
                            if (normalizeKey(k) === target)
                              return storedMap[k] as string;
                          }
                          return undefined;
                        };

                        const candidateUrl =
                          lookupStored(opt.key) ||
                          lookupStored(String(opt.label)) ||
                          DOOR_BUTTON_SRC[opt.key];

                        // match Amenities behavior: use iconActive when selected, otherwise icon; candidateUrl (override) should be used for overlay mapping but not replace selected appearance
                        const iconNode =
                          opt.key === "1" || opt.key === "2"
                            ? selectedOption.doorChoice === opt.key
                              ? opt.iconActive || opt.icon
                              : opt.icon
                            : opt.key === "ramp"
                              ? selectedOption.hasRamp
                                ? opt.iconActive || opt.icon
                                : opt.icon
                              : opt.key === "emergency"
                                ? selectedOption.highLow
                                  ? opt.iconActive || opt.icon
                                  : opt.icon
                                : opt.icon;

                        nodes.push(
                          <SelectionCard
                            key={opt.key}
                            icon={iconNode}
                            label={opt.label}
                            isSelected={
                              opt.key === "1" || opt.key === "2"
                                ? selectedOption.doorChoice === opt.key
                                : opt.key === "ramp"
                                  ? selectedOption.hasRamp
                                  : opt.key === "emergency"
                                    ? selectedOption.highLow
                                    : false
                            }
                            onClick={() => handleSelect(opt)}
                            variant="light"
                            hideLabel
                            appearance="group"
                            groupSize="lg"
                            fill
                            disabled={disabled}
                          />,
                        );

                        // After the second icon (index 1), insert the heading "ทางอื่นๆ"
                        if (idx === 1) {
                          nodes.push(
                            <div
                              key="other-heading"
                              className="col-span-2 md:col-span-4"
                            >
                              <h3 className="text-xl font-prompt font-semibold text-[#003366] mt-2">
                                ทางอื่นๆ (สามารถเลือกประกอบได้)
                              </h3>
                            </div>,
                          );
                        }
                      });
                      return nodes;
                    }
                  })()}
                </div>
              </div>
            </div>
          </section>
        </div>
      </CustomizationScreen>

      <ErrorModal
        isOpen={isErrorModalOpen}
        title="ข้อผิดพลาด"
        message={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </>
  );
};

export default DoorScreen;
