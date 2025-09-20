import React, { useEffect, useState } from "react";
import CustomizationScreen from "../components/CustomizationScreen";
import SelectionCard from "../components/SelectionCard";
import CtaButton from "../components/CtaButton";
import VehiclePreview from "../components/VehiclePreview";
import { useNavigate } from "react-router-dom";
import StepTabs from "../components/StepTabs";
import styles from "./chassis.module.css";
import { useBusDesign } from "../context/BusDesignContext";

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

// Amenity icons (same assets as AmenitiesScreen)
const IconAir = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fee1c18a935564e92bb49991fac3b76df?format=webp&width=800"
    alt="แอพ"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);

const IconFan = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe01792ee89e240808ed47d8576b55d71?format=webp&width=800"
    alt="พัด���ม"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconSeat = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F93439b2533284cdf914fc93cafa1cf26?format=webp&width=800"
    alt="ที่นั่งพิเศษ"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconWifi = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb0789bfd1100472f8351704764607d31?format=webp&width=800"
    alt="ที่จับ/ราวยืน"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconPlug = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F09a78e31a3de44e98772b0eef382af6f?format=webp&width=800"
    alt="ช่องชาร์จมือถือ/USB"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconTv = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcb0cbf9ef6764e2d9e6f06e87827f5e9?format=webp&width=800"
    alt="Wi‑Fi ฟรี"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconCup = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe903bdf27bab4175824c159bc19a02ba?format=webp&width=800"
    alt="ระบบประกาศบอกป้าย(เสียง/อ)"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconCam = () => (
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
  "แอร์": <IconAir />,
  "พัดลม": <IconFan />,
  "ที่นั่งพิเศษ": <IconSeat />,
  "ที่จับ/ราวยืนที่ปลอดภัย": <IconWifi />,
  "ช่องชาร์จมือถือ/USB": <IconPlug />,
  "Wi‑Fi ฟรี": <IconTv />,
  "ระบบประกาศบอกป้าย(เสียง/จอ)": <IconCup />,
  "กล้องวงจรปิด": <IconCam />,
};

const MONEY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fedd20330d80c48ec8b9d209a2451b32e?format=webp&width=800";
const MONEY_ICON_ACTIVE =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F10731bbf75d54bd78e73242174e90687?format=webp&width=800";
const SCAN_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1def81c8453e4753b63c9ae1ce9bcd4e?format=webp&width=800";
const SCAN_ICON_ACTIVE =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F37c0e26d7e834005a5d7c26bb0de8bf7?format=webp&width=800";
const SCAN2_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F73370cb5f352472abbed78743b555331?format=webp&width=1600";
const TOUCH_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4e22405c00c84fbfb1cd43fea6d8f8b4?format=webp&width=800";
const MONTHLY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff841cf7477174217b2aa753d7acb4b21?format=webp&width=800";
const BUS_EMPLOY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F47fc617541cf45f28b7aa2d1b8deaf64?format=webp&width=800";

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
  const { state } = useBusDesign();
  const [selected, setSelected] = useState<string[]>(["เงินสด"]);

  const storedColorLocal = state?.exterior?.color || (() => {
    try {
      const raw = sessionStorage.getItem("design.color");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("design.payment");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          // Normalize items: accept either keys (cash/scan/...) or labels (เงินสด/...)
          const normalized = arr.map((item: string) => {
            const found = OPTIONS.find(
              (o) => o.key === item || o.label === item,
            );
            return found ? found.label : item;
          });
          setSelected(normalized);
        }
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
      sessionStorage.setItem("design.payment", JSON.stringify(selected));
    } catch (e) {}
    navigate("/ukpack2/doors");
  };

  return (
    <CustomizationScreen
      title="ปรับแต่งร���เมล์ของคุณ"
      theme="light"
      fullWidth
      footerContent={
        <div className="flex justify-center">
          <CtaButton text="ถัดไป" onClick={handleNext} />
        </div>
      }
    >
      <div className={styles.contentGrid}>
        <div className="w-full rounded-md flex flex-col items-center justify-center gap-2">
          {/* show selected hero bus image from chassis selection with overlays from previous steps */}
          {(() => {
            const CHASSIS_LABELS: Record<string, string> = {
              small: "รถเมล์ขนาดเล็ก 16–30 ที่นั่ง",
              medium: "รถเมล์มาตรฐาน 30–50 ที่นั่ง",
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
            let selectedChassis = state?.chassis || "medium";
            try {
              if (!state?.chassis) {
                const saved = sessionStorage.getItem("design.chassis");
                if (saved) selectedChassis = saved;
              }
            } catch (e) {}
            const label = CHASSIS_LABELS[selectedChassis] || "";
            const img = HERO_IMAGE[selectedChassis];

            // read selected amenities from sessionStorage
            const [amenitiesFromStorage] = (() => {
              try {
                const raw = sessionStorage.getItem("design.amenities");
                return raw ? [JSON.parse(raw) as string[]] : [[] as string[]];
              } catch {
                return [[] as string[]];
              }
            })();

            // read selected doors from sessionStorage
            const doorsFromStorage = (() => {
              try {
                const raw = sessionStorage.getItem("design.doors");
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                return typeof parsed === "string" ? parsed : parsed;
              } catch {
                return sessionStorage.getItem("design.doors");
              }
            })();

            // combine amenities + payment selections + doors for overlay
            const overlayLabels: string[] = [
              ...(amenitiesFromStorage || []),
              ...(selected || []),
            ];

            // Add door selection to overlay
            if (doorsFromStorage) {
              if (typeof doorsFromStorage === "string") {
                overlayLabels.push(doorsFromStorage);
              } else if (typeof doorsFromStorage === "object") {
                // Handle door object format
                if (doorsFromStorage.doorChoice) {
                  overlayLabels.push(doorsFromStorage.doorChoice);
                } else if (doorsFromStorage.hasRamp) {
                  overlayLabels.push("ramp");
                } else if (doorsFromStorage.highLow) {
                  overlayLabels.push("emergency");
                }
              }
            }

            const renderOverlayIcon = (label: string, idx: number) => {
              // check amenities map first
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

              // check door selections
              if (label === "1")
                return (
                  <div
                    key={`${label}-${idx}`}
                    className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                  >
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9811f9bca05c43feae9eafdcbab3c8d9?format=webp&width=800"
                      alt="1 ประตู"
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
                      alt="2 ประตู"
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
                      alt="ทางลาด"
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
                      alt="ประตูุกเฉิน"
                      className="h-6 w-6 md:h-7 md:w-7 object-contain"
                    />
                  </div>
                );

              // fallback to payment options
              const opt = OPTIONS.find((o) => o.label === label);
              if (!opt)
                return (
                  <div
                    key={`${label}-${idx}`}
                    className="bg-white/90 backdrop-blur rounded-full p-1 shadow-md h-8 w-8 flex items-center justify-center text-xs"
                  >
                    ?
                  </div>
                );
              if (opt.key === "cash")
                return (
                  <div
                    key={`${label}-${idx}`}
                    className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                  >
                    <img
                      src={MONEY_ICON}
                      alt={label}
                      className="h-6 w-6 md:h-7 md:w-7 object-contain"
                    />
                  </div>
                );
              if (opt.key === "scan")
                return (
                  <div
                    key={`${label}-${idx}`}
                    className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                  >
                    <img
                      src={SCAN_ICON}
                      alt={label}
                      className="h-6 w-6 md:h-7 md:w-7 object-contain"
                    />
                  </div>
                );
              if (opt.key === "scan2")
                return (
                  <div
                    key={`${label}-${idx}`}
                    className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                  >
                    <img
                      src={SCAN2_ICON}
                      alt={label}
                      className="h-6 w-6 md:h-7 md:w-7 object-contain"
                    />
                  </div>
                );
              if (opt.key === "tap")
                return (
                  <div
                    key={`${label}-${idx}`}
                    className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                  >
                    <img
                      src={TOUCH_ICON}
                      alt={label}
                      className="h-6 w-6 md:h-7 md:w-7 object-contain"
                    />
                  </div>
                );
              if (opt.key === "qr")
                return (
                  <div
                    key={`${label}-${idx}`}
                    className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                  >
                    <img
                      src={BUS_EMPLOY_ICON}
                      alt={label}
                      className="h-6 w-6 md:h-7 md:w-7 object-contain"
                    />
                  </div>
                );
              if (opt.key === "monthly")
                return (
                  <div
                    key={`${label}-${idx}`}
                    className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                  >
                    <img
                      src={MONTHLY_ICON}
                      alt={label}
                      className="h-6 w-6 md:h-7 md:w-7 object-contain"
                    />
                  </div>
                );
              // default to provided icon node
              return (
                <div
                  key={`${label}-${idx}`}
                  className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                >
                  {opt.icon}
                </div>
              );
            };

            return img ? (
              <>
                <VehiclePreview
                  imageSrc={img}
                  colorFilter={storedColorLocal?.filter}
                  colorHex={storedColorLocal?.colorHex}
                  label={label}
                  showSelectedText
                  overlayLabels={overlayLabels}
                  overlayIconMap={{
                    ...AMENITIES_ICON_MAP,
                    "เงินสด": (
                      <img
                        src={selected.includes("เงินสด") ? MONEY_ICON_ACTIVE : MONEY_ICON}
                        alt="เง���นสด"
                        className="h-5 w-5 object-contain"
                      />
                    ),
                    "สแกนจ่าย": (
                      <img
                        src={selected.includes("สแกนจ่าย") ? SCAN_ICON_ACTIVE : SCAN_ICON}
                        alt="สแกนจ่าย"
                        className="h-5 w-5 object-contain"
                      />
                    ),
                    "สแกนจ่าย 2": (
                      <img
                        src={SCAN2_ICON}
                        alt="สแกนจ่าย 2"
                        className="h-5 w-5 object-contain"
                      />
                    ),
                    "แตะบัตร": (
                      <img
                        src={TOUCH_ICON}
                        alt="แตะบัตร"
                        className="h-5 w-5 object-contain"
                      />
                    ),
                    "กระ��ป๋ารถเมล์": (
                      <img
                        src={BUS_EMPLOY_ICON}
                        alt="กระเป๋ารถเมล์"
                        className="h-5 w-5 object-contain"
                      />
                    ),
                    "ตั๋วรายเดือน/รอบ": (
                      <img
                        src={MONTHLY_ICON}
                        alt="ตั๋วรายเดือน/รอบ"
                        className="h-5 w-5 object-contain"
                      />
                    ),
                  }}
                />
              </>
            ) : (
              <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">
                Bus image preview
              </div>
            );
          })()}
        </div>
        <section className={`${styles.controlsSection} ${styles.controlsWrapper}`}>
          <div className={styles.tabsWrapper}>
            <StepTabs active={4} />
          </div>

          <div className={styles.controlsBox}>
            <div className={styles.controlsContent}>
              <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">
                ก���รจ่ายเงิน
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {OPTIONS.map((o) => {
                  const isSel = selected.includes(o.label);
                  const iconNode =
                    o.key === "cash" ? (
                      <img
                        src={isSel ? MONEY_ICON_ACTIVE : MONEY_ICON}
                        alt={o.label}
                        className={`object-contain select-none h-full w-full `}
                        decoding="async"
                        loading="eager"
                      />
                    ) : o.key === "scan" ? (
                      <img
                        src={isSel ? SCAN_ICON_ACTIVE : SCAN_ICON}
                        alt={o.label}
                        className={`object-contain select-none h-full w-full `}
                        decoding="async"
                        loading="eager"
                      />
                    ) : o.key === "scan2" ? (
                      <img
                        src={SCAN2_ICON}
                        alt={o.label}
                        className={`object-contain select-none h-full w-full `}
                        decoding="async"
                        loading="eager"
                      />
                    ) : o.key === "tap" ? (
                      <img
                        src={TOUCH_ICON}
                        alt={o.label}
                        className={`object-contain select-none h-full w-full `}
                        decoding="async"
                        loading="eager"
                      />
                    ) : o.key === "qr" ? (
                      <img
                        src={BUS_EMPLOY_ICON}
                        alt={o.label}
                        className={`object-contain select-none h-full w-full `}
                        decoding="async"
                        loading="eager"
                      />
                    ) : o.key === "monthly" ? (
                      <img
                        src={MONTHLY_ICON}
                        alt={o.label}
                        className={`object-contain select-none h-full w-full `}
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
                      hideLabel
                      appearance="group"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </CustomizationScreen>
  );
};

export default PaymentScreen;
