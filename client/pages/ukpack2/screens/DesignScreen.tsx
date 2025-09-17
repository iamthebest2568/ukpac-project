import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import ColorPalette from "../components/ColorPalette";
import CtaButton from "../components/CtaButton";
import VehiclePreview from "../components/VehiclePreview";

// small amenity icons (same assets as other screens)
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
    alt="ระบบประกาศ"
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
      d="M19 8l2-2v10l2-2"
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
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9349b93d24274adc91be5f4657facdda?format=webp&width=800";
const SCAN_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbc97b87e6027435fb25a72f5478406cd?format=webp&width=800";
const SCAN2_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F56620e798eb94153b2390271f30d0dae?format=webp&width=800";
const TOUCH_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4e22405c00c84fbfb1cd43fea6d8f8b4?format=webp&width=800";
const MONTHLY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff841cf7477174217b2aa753d7acb4b21?format=webp&width=800";
const BUS_EMPLOY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F47fc617541cf45f28b7aa2d1b8deaf64?format=webp&width=800";

const DEFAULT_COLORS = [
  {
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5456dc0212c14ba6a327d537ceed405e?format=webp&width=800",
    filter: "hue-rotate(0deg) saturate(1) brightness(1)", // blue/original
  },
  {
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F60613c947767482aa9d75e7414cdf10a?format=webp&width=800",
    filter: "hue-rotate(30deg) saturate(1.2) brightness(1.1)", // orange
  },
  {
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F257808683b104f7fb4c3d4ba712b4ef0?format=webp&width=800",
    filter: "hue-rotate(120deg) saturate(1.3) brightness(1)", // green
  },
  {
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc1540ee8e580442bbcfe1c7cbf7ca0ca?format=webp&width=800",
    filter: "hue-rotate(300deg) saturate(1.2) brightness(1)", // purple
  },
  {
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F31b9a82b697a46a6b5b14e32002472d8?format=webp&width=800",
    filter: "hue-rotate(0deg) saturate(1.5) brightness(1.2)", // bright blue
  },
  {
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcae7472130bc47f09f28af725a944548?format=webp&width=800",
    filter: "hue-rotate(60deg) saturate(1.4) brightness(1.1)", // yellow
  },
  {
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F117b0cdb42744374a5999f03625d56aa?format=webp&width=800",
    filter: "hue-rotate(0deg) saturate(0.8) brightness(0.7)", // dark blue
  },
  {
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fee9ba92b67734653865abb9c651119d6?format=webp&width=800",
    filter: "hue-rotate(180deg) saturate(1.1) brightness(1)", // cyan
  },
  {
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ffae13b859b7c45eba3e49272be7622d2?format=webp&width=800",
    filter: "hue-rotate(240deg) saturate(1.3) brightness(0.9)", // dark purple
  },
  {
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9ba49f215d7d4abca6a601bdee2d7bd5?format=webp&width=800",
    filter: "hue-rotate(0deg) saturate(0) brightness(0.4)", // black
  },
  {
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F30bc6908a9fc4a9e96afd58e5885af1b?format=webp&width=800",
    filter: "hue-rotate(0deg) saturate(0) brightness(0.7)", // dark gray
  },
  {
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F321fa0e9571a4e34b5fe6beffc1fbbed?format=webp&width=800",
    filter: "hue-rotate(0deg) saturate(0) brightness(1.3)", // white
  },
];

const DesignScreen: React.FC = () => {
  const navigate = useNavigate();
  const [color, setColor] = useState<(typeof DEFAULT_COLORS)[0]>(
    DEFAULT_COLORS[0],
  );
  const [slogan, setSlogan] = useState<string>("");
  const [showTextarea, setShowTextarea] = useState<boolean>(false);
  const [sloganDraft, setSloganDraft] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (showTextarea) {
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [showTextarea]);

  const handleFinish = () => {
    try {
      sessionStorage.setItem("design.color", JSON.stringify(color));
      sessionStorage.setItem("design.slogan", slogan);
    } catch (e) {}
    navigate("/ukpack2/submit");
  };

  return (
    <CustomizationScreen
      title="ปรับแต่งรถเมล์ของคุณ"
      theme="light"
      footerContent={
        <div className="flex justify-center">
          <CtaButton text="ออกแบบเสร็จแล้ว" onClick={handleFinish} />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="w-full rounded-md flex flex-col items-center justify-center gap-2">
          {(() => {
            const CHASSIS_LABELS: Record<string, string> = {
              small: "รถเมล์ขนาดเล็ก 16–30 ที่นั่ง",
              medium: "รถเมล์ขนาดกลาง 31–40 ที่นั่ง",
              large: "รถเมล์ขนาดใหญ่ 41-50 ที่นั่ง",
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
            let selected = "medium";
            try {
              const saved = sessionStorage.getItem("design.chassis");
              if (saved) selected = saved;
            } catch (e) {}
            const label = CHASSIS_LABELS[selected] || "";
            const img = HERO_IMAGE[selected];
            return img ? (
              <>
                <VehiclePreview
                  imageSrc={img}
                  label={`รถที่ใช้งาน : ${label}`}
                  overlayLabels={(() => {
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
                    const doorsRaw = (() => {
                      try {
                        const raw = sessionStorage.getItem("design.doors");
                        return raw
                          ? (JSON.parse(raw) as any)
                          : raw
                            ? String(raw)
                            : null;
                      } catch {
                        return sessionStorage.getItem("design.doors");
                      }
                    })();
                    const overlayLabels: string[] = [
                      ...(amenities || []),
                      ...(payments || []),
                    ];
                    if (doorsRaw)
                      overlayLabels.push(
                        typeof doorsRaw === "string"
                          ? doorsRaw
                          : doorsRaw.doorChoice ||
                              (doorsRaw.hasRamp
                                ? "ramp"
                                : doorsRaw.highLow
                                  ? "emergency"
                                  : ""),
                      );
                    return overlayLabels;
                  })()}
                  overlayIconMap={{
                    ...AMENITIES_ICON_MAP,
                    เงินสด: <img src={MONEY_ICON} alt="เงินสด" className="h-5 w-5 object-contain" />,
                    สแกนจ่าย: <img src={SCAN_ICON} alt="สแกนจ่าย" className="h-5 w-5 object-contain" />,
                    "สแกนจ่าย 2": <img src={SCAN2_ICON} alt="สแกนจ่าย 2" className="h-5 w-5 object-contain" />,
                    แตะบัตร: <img src={TOUCH_ICON} alt="แตะบัตร" className="h-5 w-5 object-contain" />,
                    กระเป๋ารถเมล์: <img src={BUS_EMPLOY_ICON} alt="กระเป๋ารถเมล์" className="h-5 w-5 object-contain" />,
                    "ตั๋วรายเดือน/รอบ": <img src={MONTHLY_ICON} alt="ตั๋วรายเดือน/รอบ" className="h-5 w-5 object-contain" />,
                    "1": <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9811f9bca05c43feae9eafdcbab3c8d9?format=webp&width=800" alt="1 ประตู" className="h-5 w-5 object-contain" />,
                    "2": <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8f9b21942af243b3b80b0e5ac8b12631?format=webp&width=800" alt="2 ประตู" className="h-5 w-5 object-contain" />,
                    ramp: <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fece2b6fc843340f0997f2fd7d3ca0aea?format=webp&width=800" alt="ทางลาด" className="h-5 w-5 object-contain" />,
                    emergency: <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F98de0624be3d4ae6b96d83edcf8891f9?format=webp&width=800" alt="ประตูฉุกเฉิน" className="h-5 w-5 object-contain" />,
                  }}
                />
                <p className="mt-1 font-prompt font-semibold text-[#001a73] text-center">
                  รถที่ใช้งาน : {label}
                </p>
              </>
            ) : (
              <div className="w-full h-72 rounded-md flex items-center justify-center text-sm text-gray-300">
                Bus preview (color applied)
              </div>
            );
          })()}
        </div>
        <div className="max-w-4xl w-full mx-auto">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">
              ออกแบบสี
            </h2>
            <ColorPalette
              colors={DEFAULT_COLORS.map((c) => c.preview)}
              selectedColor={color?.preview || DEFAULT_COLORS[0].preview}
              onColorSelect={(colorUrl) => {
                const foundColor = DEFAULT_COLORS.find(
                  (c) => c.preview === colorUrl,
                );
                if (foundColor) setColor(foundColor);
              }}
            />

            <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-4">
              ลักษณะพิเศษอื่น ๆ ของรถคุณ
            </h2>
            <div>
              <input
                type="text"
                value={slogan}
                readOnly
                onClick={() => {
                  setSloganDraft(slogan);
                  setShowTextarea(true);
                }}
                placeholder="พิมพ์ คุณสมบัติพิเศษ"
                className="w-full rounded-md px-4 py-2 bg-white border border-[#e5e7eb] text-[#003366] placeholder-gray-400 cursor-text"
              />

              {showTextarea && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="bg-white rounded-lg p-4 max-w-lg w-full mx-4">
                    <h3 className="text-lg font-prompt font-semibold text-[#000d59]">
                      ลักษณะพิเศษอื่นๆ
                    </h3>
                    <textarea
                      ref={textareaRef}
                      value={sloganDraft}
                      onChange={(e) => setSloganDraft(e.target.value)}
                      placeholder="พิมพ์คุณสมบัติพิเศษอื่นๆ ของรถเมล์ในฝันของคุณ"
                      className="mt-3 w-full h-36 p-3 border rounded-md text-sm resize-none"
                    />
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => setShowTextarea(false)}
                        className="px-4 py-2 rounded-md bg-[#ffe000] text-black hover:bg-[#000d59] hover:text-white transition-colors"
                      >
                        ยกเลิก
                      </button>
                      <button
                        onClick={() => {
                          setSlogan(sloganDraft);
                          setShowTextarea(false);
                        }}
                        className="px-4 py-2 rounded-md bg-[#ffe000] text-black hover:bg-[#000d59] hover:text-white transition-colors"
                      >
                        บันทึก
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default DesignScreen;
