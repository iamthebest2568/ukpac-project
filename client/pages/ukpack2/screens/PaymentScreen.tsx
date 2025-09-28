import React, { useEffect, useState } from "react";
import CustomizationScreen from "../components/CustomizationScreen";
import SelectionCard from "../components/SelectionCard";
import CtaButton from "../components/CtaButton";
import VehiclePreview from "../components/VehiclePreview";
import Uk2Footer from "../components/Uk2Footer";
import { useNavigate } from "react-router-dom";
import StepTabs from "../components/StepTabs";
import styles from "./chassis.module.css";
import { useBusDesign } from "../context/BusDesignContext";
import { OVERLAY_ICON_SRC } from "../utils/overlayIcons";
import { HERO_IMAGE, CHASSIS_LABELS } from "../utils/heroImages";

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
  แอร์: <IconAir />,
  พัดลม: <IconFan />,
  ที่นั่งพิเศษ: <IconSeat />,
  "ที่จับ/ราวยืนที่ปลอดภัย": <IconWifi />,
  "ช่องชาร์จมือถือ/USB": <IconPlug />,
  "Wi‑Fi ฟรี": <IconTv />,
  "ระบบประกาศบอกป้าย(เสียง/จอ)": <IconCup />,
  กล้องวงจรปิด: <IconCam />,
};

const MONEY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fedd20330d80c48ec8b9d209a2451b32e?format=webp&width=800";
const CASH_OVERLAY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe05d5e81984848ed830fcea15421622d?format=webp&width=800";
const MONEY_ICON_ACTIVE =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F10731bbf75d54bd78e73242174e90687?format=webp&width=800";
const SCAN_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbb681a2c2eb2482fb548f473f88a7f6c?format=webp&width=800";
const SCAN_ICON_ACTIVE =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8da37169df5c447eb8937bd67957a8e9?format=webp&width=800";
const SCAN2_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F624c968962fb4fe4b44d1a45a4ed38ff?format=webp&width=800";
const SCAN2_ICON_ACTIVE =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F3457f67ed4ae4534bcdd4bd84ea928ae?format=webp&width=800";
const TOUCH_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4c7862dfe0cb436e88451219585438e2?format=webp&width=800";
const TOUCH_ICON_ACTIVE =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff34b222b6a6c4646803fe5fb4c27b2fb?format=webp&width=800";
const MONTHLY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F317d08ac637c469183e11074bb390d6b?format=webp&width=800";
const MONTHLY_ICON_ACTIVE =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc45bc2c52e35481b82d7f164bab3cf7c?format=webp&width=800";
const BUS_EMPLOY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F70ea0f54beea4e5291e4838094456c19?format=webp&width=800";
const BUS_EMPLOY_ICON_ACTIVE =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F68666486df5e439b865514466401db22?format=webp&width=800";

const OPTIONS = [
  { key: "cash", label: "เงินสด", icon: <IconCash /> },
  { key: "scan", label: "สแกนจ่าย", icon: <IconScan /> },
  { key: "tap", label: "แตะบัตร", icon: <IconTap /> },
  { key: "monthly", label: "ต���๋วรายเดือน/รอบ", icon: null },
  { key: "scan2", label: "ตู้อัตโนมัติ", icon: null },
  { key: "qr", label: "กระเป๋ารถเมล์", icon: <IconQr /> },
];

const PaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useBusDesign();
  const [selected, setSelected] = useState<string[]>([]);

  const storedColorLocal =
    state?.exterior?.color ||
    (() => {
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

  const ICON_SETS: Record<string, string[]> = {
    เงินส���: [
      MONEY_ICON,
      MONEY_ICON_ACTIVE,
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F29e4422ee7ff4d72a3f359831ac92c32?format=webp&width=800",
    ],
    สแกนจ่าย: [
      SCAN_ICON,
      SCAN_ICON_ACTIVE,
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe9e95c0ee1cf44c782478f7ca3e7cac9?format=webp&width=800",
    ],
    ตู้อัตโนมัติ: [
      SCAN2_ICON,
      SCAN2_ICON_ACTIVE,
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F450e64db5b824f5c92cb33d5993705f6?format=webp&width=800",
    ],
    แตะบัตร: [
      TOUCH_ICON,
      TOUCH_ICON_ACTIVE,
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc25d540d10cc44e6922d714177b11d94?format=webp&width=800",
    ],
    กระเป๋ารถเมล์: [
      BUS_EMPLOY_ICON,
      BUS_EMPLOY_ICON_ACTIVE,
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc672415acf294449bc41d44cd9434120?format=webp&width=800",
    ],
    "ตั๋วรายเดือน/รอบ": [
      MONTHLY_ICON,
      MONTHLY_ICON_ACTIVE,
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb7f2ac177a8848c18451c8d3f5109582?format=webp&width=800",
    ],
  };

  const toggle = (label: string) => {
    setSelected((prev) => {
      const isSelected = prev.includes(label);
      const next = isSelected
        ? prev.filter((l) => l !== label)
        : [...prev, label];

      // update sessionStorage overlayIconMap immediately when selecting/unselecting
      try {
        const raw = sessionStorage.getItem("design.overlayIconMap");
        const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};

        const normalizeKey = (s: string) =>
          (s || "")
            .replace(/\uFFFD/g, "")
            .replace(/\u2011/g, "-")
            .replace(/\u00A0/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

        const setVariants = (key: string, val: string) => {
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

        if (!isSelected) {
          // selecting  persist icon3 if available
          const set = ICON_SETS[label];
          if (set && set[2]) {
            setVariants(label, set[2]);
            // also map by option key if exists (cash/scan/...)
            const opt = OPTIONS.find((o) => o.label === label);
            if (opt && opt.key) setVariants(opt.key, set[2]);
          }
        } else {
          // unselecting — remove overlay mapping (remove variants we set)
          try {
            const opt = OPTIONS.find((o) => o.label === label);
            const keysToRemove = [label];
            if (opt && opt.key) keysToRemove.push(opt.key);
            const nk = normalizeKey(label);
            keysToRemove.push(nk, nk.replace(/\s/g, ""));
            for (const k of keysToRemove) {
              if (k && map[k]) delete map[k];
            }
          } catch (e) {
            // ignore
          }
        }
        sessionStorage.setItem("design.overlayIconMap", JSON.stringify(map));
      } catch (e) {
        // ignore
      }

      return next;
    });
  };

  const PAYMENT_BUTTON_SRC: Record<string, string> = {
    เงินสด: MONEY_ICON,
    สแกนจ่าย: SCAN_ICON,
    ตู้อัตโนมัติ: SCAN2_ICON,
    แตะบัตร: TOUCH_ICON,
    "ตั๋วรายเดือน/รอบ": MONTHLY_ICON,
    กระเป๋ารถเมล์: BUS_EMPLOY_ICON,
  };

  const handleNext = () => {
    try {
      sessionStorage.setItem("design.payment", JSON.stringify(selected));
      // persist overlay icon mapping for selected payment methods
      try {
        const raw = sessionStorage.getItem("design.overlayIconMap");
        const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};

        const normalizeKey = (s: string) =>
          (s || "")
            .replace(/\uFFFD/g, "")
            .replace(/\u2011/g, "-")
            .replace(/\u00A0/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

        const setVariantsIfEmpty = (key: string, val: string) => {
          try {
            if (!map[key]) map[key] = val;
            const nk = normalizeKey(key);
            if (nk && !map[nk]) map[nk] = val;
            const nkNoSpace = nk.replace(/\s/g, "");
            if (nkNoSpace && !map[nkNoSpace]) map[nkNoSpace] = val;
          } catch (e) {
            // ignore
          }
        };

        selected.forEach((lab) => {
          if (OVERLAY_ICON_SRC[lab]) {
            // prefer not overwriting any user-set values, but populate normalized variants when empty
            setVariantsIfEmpty(lab, OVERLAY_ICON_SRC[lab]);
            const opt = OPTIONS.find((o) => o.label === lab);
            if (opt && opt.key)
              setVariantsIfEmpty(opt.key, OVERLAY_ICON_SRC[lab]);
          }
        });
        sessionStorage.setItem("design.overlayIconMap", JSON.stringify(map));
      } catch (e) {}
    } catch (e) {}
    navigate("/mydreambus/doors");
  };

  return (
    <CustomizationScreen
      title="ออกแบบรถเมล์ของคุณ"
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
          {/* show selected hero bus image from chassis selection with overlays from previous steps */}
          {(() => {
            const selectedChassis = (() => {
              try {
                return (
                  state?.chassis ||
                  sessionStorage.getItem("design.chassis") ||
                  "medium"
                );
              } catch (e) {
                return "medium";
              }
            })();
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
            // Normalize known corrupted label encodings (in case values were stored with encoding issues)
            const CORRECT_LABELS: Record<string, string> = {
              ตู้อัตโนมัติ: "ตู้อัตโนมัติ",
              แตะบัตร: "แตะบัตร",
              กระเป๋ารถเมล์: "กระเป๋ารถเมล์",
              เงินสด: "เงินสด",
            };
            const stripReplacement = (s: string) =>
              (s || "")
                .replace(/\uFFFD/g, "") // remove replacement chars only
                .replace(/\u2011/g, "-") // normalize no-break hyphen to normal hyphen
                .replace(/\s+/g, " ")
                .trim();

            const normalizedOverlayLabels = overlayLabels.map((l) => {
              if (!l) return l;
              if (CORRECT_LABELS[l]) return CORRECT_LABELS[l];
              const cleaned = stripReplacement(l);
              if (CORRECT_LABELS[cleaned]) return CORRECT_LABELS[cleaned];
              return cleaned;
            });

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
                      src={
                        selected.includes("สแกนจ่าย")
                          ? SCAN_ICON_ACTIVE
                          : SCAN_ICON
                      }
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
                      src={
                        selected.includes("ตู้อัตโนมัติ")
                          ? SCAN2_ICON_ACTIVE
                          : SCAN2_ICON
                      }
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
                      src={
                        selected.includes("แตะบัตร")
                          ? TOUCH_ICON_ACTIVE
                          : TOUCH_ICON
                      }
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
                      src={
                        selected.includes("กระเป๋รถเมล์")
                          ? BUS_EMPLOY_ICON_ACTIVE
                          : BUS_EMPLOY_ICON
                      }
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
                      src={
                        selected.includes("ตั๋วรายเดื���น/รอบ")
                          ? MONTHLY_ICON_ACTIVE
                          : MONTHLY_ICON
                      }
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
                  label={label}
                  showSelectedText
                  overlayLabels={normalizedOverlayLabels}
                  overlayIconMap={(() => {
                    // Prefer stored session URLs, then canonical OVERLAY_ICON_SRC constants (strings)
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

                    const merged: Record<string, string> = {};
                    const setVariants = (key: string, val: string) => {
                      merged[key] = val;
                      try {
                        const nk = normalizeKey(key);
                        if (nk) merged[nk] = val;
                        const nkNoSpace = nk.replace(/\s/g, "");
                        if (nkNoSpace) merged[nkNoSpace] = val;
                      } catch {}
                    };

                    for (const k of Object.keys(storedMapRaw)) {
                      try {
                        setVariants(k, storedMapRaw[k]);
                      } catch {}
                    }

                    try {
                      for (const k of Object.keys(OVERLAY_ICON_SRC)) {
                        if (!merged[k]) setVariants(k, OVERLAY_ICON_SRC[k]);
                      }
                    } catch {}

                    // Ensure payment-specific keys are present
                    const explicit = [
                      "เงินสด",
                      "สแกนจ่าย",
                      "ตู้อัตโนมัติ",
                      "แตะบัตร",
                      "กระเป๋ารถเมล์",
                      "ตั๋วรายเดือน/รอบ",
                    ];
                    for (const k of explicit) {
                      if (!merged[k] && (OVERLAY_ICON_SRC as any)[k])
                        setVariants(k, (OVERLAY_ICON_SRC as any)[k]);
                    }

                    return merged;
                  })()}
                />
              </>
            ) : (
              <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">
                Bus image preview
              </div>
            );
          })()}
        </div>
        <section
          className={`${styles.controlsSection} ${styles.controlsWrapper}`}
        >
          <div className={styles.tabsWrapper}>
            <StepTabs active={4} />
          </div>

          <div className={styles.controlsBox}>
            <div className={styles.controlsContent}>
              <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">
                การจ่ายเงิน
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {(() => {
                  // Prefer overlayIconMap URLs from sessionStorage when available
                  let storedMap: Record<string, string | null> = {};
                  try {
                    const raw = sessionStorage.getItem("design.overlayIconMap");
                    if (raw)
                      storedMap = JSON.parse(raw) as Record<string, string>;
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

                  const lookupStored = (labelOrKey: string) => {
                    if (!labelOrKey) return undefined;
                    // direct match
                    if (storedMap[labelOrKey])
                      return storedMap[labelOrKey] as string;
                    // normalized match
                    const target = normalizeKey(labelOrKey);
                    for (const k of Object.keys(storedMap)) {
                      if (normalizeKey(k) === target)
                        return storedMap[k] as string;
                    }
                    return undefined;
                  };

                  return OPTIONS.map((o) => {
                    const isSel = selected.includes(o.label);

                    // Lookup order: normalized storedMap(label), storedMap(key), explicit constants
                    const overlayUrl =
                      lookupStored(o.label) || lookupStored(o.key);

                    const baseIcon =
                      o.key === "cash"
                        ? isSel
                          ? MONEY_ICON_ACTIVE
                          : MONEY_ICON
                        : o.key === "scan"
                          ? isSel
                            ? SCAN_ICON_ACTIVE
                            : SCAN_ICON
                          : o.key === "scan2"
                            ? isSel
                              ? SCAN2_ICON_ACTIVE
                              : SCAN2_ICON
                            : o.key === "tap"
                              ? isSel
                                ? TOUCH_ICON_ACTIVE
                                : TOUCH_ICON
                              : o.key === "qr"
                                ? isSel
                                  ? BUS_EMPLOY_ICON_ACTIVE
                                  : BUS_EMPLOY_ICON
                                : o.key === "monthly"
                                  ? isSel
                                    ? MONTHLY_ICON_ACTIVE
                                    : MONTHLY_ICON
                                  : null;

                    // If selected and ICON_SETS provides a second icon (index 1), prefer that for the selected card appearance.
                    const selectedIconOverride =
                      isSel && ICON_SETS[o.label] && ICON_SETS[o.label][1]
                        ? ICON_SETS[o.label][1]
                        : undefined;

                    const iconNode = selectedIconOverride ? (
                      <img
                        src={selectedIconOverride}
                        alt={o.label}
                        className={`object-contain select-none h-full w-full `}
                        decoding="async"
                        loading="eager"
                      />
                    ) : baseIcon ? (
                      <img
                        src={baseIcon}
                        alt={o.label}
                        className={`object-contain select-none h-full w-full `}
                        decoding="async"
                        loading="eager"
                      />
                    ) : overlayUrl ? (
                      // overlayUrl should be used for overlays across pages, not to replace the primary card icon if base icon exists
                      <img
                        src={overlayUrl}
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
                  });
                })()}
              </div>
            </div>
          </div>
        </section>
      </div>
    </CustomizationScreen>
  );
};

export default PaymentScreen;
