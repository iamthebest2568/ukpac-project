import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SelectionCard from "../components/SelectionCard";
import VehiclePreview from "../components/VehiclePreview";
import CtaButton from "../components/CtaButton";
import StepTabs from "../components/StepTabs";
import styles from "./chassis.module.css";

// Amenity icons (small versions)
const IconAir = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fee1c18a935564e92bb49991fac3b76df?format=webp&width=800"
    alt="แอร์"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconFan = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe01792ee89e240808ed47d8576b55d71?format=webp&width=800"
    alt="พัดลม"
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
    alt="ระบบประกาศบอกป้าย(เสียง/จอ)"
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
  "ช่องชาร์จมือถือ/USB": <IconPlug />,
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
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9811f9bca05c43feae9eafdcbab3c8d9?format=webp&width=800"
    alt="ประตู 1"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconDoor2 = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8f9b21942af243b3b80b0e5ac8b12631?format=webp&width=800"
    alt="ประตู 2"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconRamp = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fece2b6fc843340f0997f2fd7d3ca0aea?format=webp&width=800"
    alt="ทางสำหรับรถเข็น/ผู้พิการ"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconHighLow = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F98de0624be3d4ae6b96d83edcf8891f9?format=webp&width=800"
    alt="ประตูฉุกเฉิน"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);

const DoorScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string>(() => {
    try {
      const raw = sessionStorage.getItem("design.doors");
      if (!raw) return "1";
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string") return parsed;
      if (parsed && typeof parsed === "object") {
        if (parsed.doorChoice) return parsed.doorChoice as string;
        if (parsed.hasRamp) return "ramp";
        if (parsed.highLow) return "emergency";
      }
    } catch (e) {
      // ignore
    }
    return "1";
  });

  const handleNext = () => {
    try {
      // store single selected option (string) for doors
      sessionStorage.setItem("design.doors", JSON.stringify(selectedOption));
    } catch (e) {}
    navigate("/ukpack2/design");
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
          {(() => {
            const CHASSIS_LABELS: Record<string, string> = {
              small: "รถเมล์ขนาดเล็ก 16–30 ที่นั่ง",
              medium: "รถเมล์มาตร���าน 30–50 ที่นั่ง",
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
            if (selectedOption) overlayLabels.push(selectedOption);

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
              if (label === "เงินสด")
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
              if (label === "สแกนจ่าย 2")
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
                      alt="ประตูฉุกเฉิน"
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
                <VehiclePreview
                  imageSrc={img}
                  colorFilter={storedColor?.filter}
                  label={
                    <>
                      <span className="chassis-label-mobile">
                        รถที่เลือก :{" "}
                      </span>
                      {label}
                    </>
                  }
                  overlayLabels={overlayLabels}
                  overlayIconMap={{
                    ...AMENITIES_ICON_MAP,
                    เงินสด: (
                      <img
                        src={MONEY_ICON}
                        alt="เงินสด"
                        className="h-5 w-5 object-contain"
                      />
                    ),
                    สแกนจ่าย: (
                      <img
                        src={SCAN_ICON}
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
                    แตะบัตร: (
                      <img
                        src={TOUCH_ICON}
                        alt="แตะบัตร"
                        className="h-5 w-5 object-contain"
                      />
                    ),
                    กระเป๋ารถเมล์: (
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
                    "1": (
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9811f9bca05c43feae9eafdcbab3c8d9?format=webp&width=800"
                        alt="1 ประตู"
                        className="h-5 w-5 object-contain"
                      />
                    ),
                    "2": (
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8f9b21942af243b3b80b0e5ac8b12631?format=webp&width=800"
                        alt="2 ประตู"
                        className="h-5 w-5 object-contain"
                      />
                    ),
                    ramp: (
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fece2b6fc843340f0997f2fd7d3ca0aea?format=webp&width=800"
                        alt="ทางลาด"
                        className="h-5 w-5 object-contain"
                      />
                    ),
                    emergency: (
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F98de0624be3d4ae6b96d83edcf8891f9?format=webp&width=800"
                        alt="ประตูฉุกเฉิน"
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
        <div className="bg-white rounded-2xl -mt-2 p-4 border border-gray-400">
          <StepTabs active={5} />

          <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">
            ประตู
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Radio group for 1 or 2 doors */}
            <SelectionCard
              icon={<IconDoor1 />}
              label={"1 ประตู"}
              isSelected={selectedOption === "1"}
              onClick={() => setSelectedOption("1")}
              variant="light"
            />
            <SelectionCard
              icon={<IconDoor2 />}
              label={"2 ประตู"}
              isSelected={selectedOption === "2"}
              onClick={() => setSelectedOption("2")}
              variant="light"
            />

            {/* Single-choice options */}
            <SelectionCard
              icon={<IconRamp />}
              label={"ทางลาดสำหรับรถเข็น/ผู้พิการ"}
              isSelected={selectedOption === "ramp"}
              onClick={() => setSelectedOption("ramp")}
              variant="light"
            />
            <SelectionCard
              icon={<IconHighLow />}
              label={"ประตูฉุกเฉิน"}
              isSelected={selectedOption === "emergency"}
              onClick={() => setSelectedOption("emergency")}
              variant="light"
            />
          </div>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default DoorScreen;
