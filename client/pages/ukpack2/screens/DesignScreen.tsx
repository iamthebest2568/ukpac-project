import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import ColorPalette from "../components/ColorPalette";
import CtaButton from "../components/CtaButton";
import HeroWithShadow from "../components/HeroWithShadow";

// small amenity icons (same assets as other screens)
const IconAir = () => (
  <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fee1c18a935564e92bb49991fac3b76df?format=webp&width=800" alt="แอร์" className="h-6 w-6 object-contain select-none" decoding="async" loading="eager" />
);
const IconFan = () => (
  <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe01792ee89e240808ed47d8576b55d71?format=webp&width=800" alt="พัดลม" className="h-6 w-6 object-contain select-none" decoding="async" loading="eager" />
);
const IconSeat = () => (
  <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F93439b2533284cdf914fc93cafa1cf26?format=webp&width=800" alt="ที่นั่งพิเศษ" className="h-6 w-6 object-contain select-none" decoding="async" loading="eager" />
);
const IconWifi = () => (
  <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb0789bfd1100472f8351704764607d31?format=webp&width=800" alt="ที่จับ/ราวยืน" className="h-6 w-6 object-contain select-none" decoding="async" loading="eager" />
);
const IconPlug = () => (
  <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F09a78e31a3de44e98772b0eef382af6f?format=webp&width=800" alt="ช่องชาร์จมือถือ/USB" className="h-6 w-6 object-contain select-none" decoding="async" loading="eager" />
);
const IconTv = () => (
  <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcb0cbf9ef6764e2d9e6f06e87827f5e9?format=webp&width=800" alt="Wi‑Fi ฟรี" className="h-6 w-6 object-contain select-none" decoding="async" loading="eager" />
);
const IconCup = () => (
  <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe903bdf27bab4175824c159bc19a02ba?format=webp&width=800" alt="ระบบประกาศ" className="h-6 w-6 object-contain select-none" decoding="async" loading="eager" />
);
const IconCamSmall = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M19 8l2-2v10l2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const AMENITIES_ICON_MAP: Record<string, JSX.Element> = {
  "แอร์": <IconAir />,
  "พัดลม": <IconFan />,
  "ที่นั่งพิเศษ": <IconSeat />,
  "ที่จับ/ราวยืนที่ปลอดภัย": <IconWifi />,
  "ช่องชาร์จมือถือ/USB": <IconPlug />,
  "Wi‑Fi ฟรี": <IconTv />,
  "ระบบประกาศบอกป้าย(เสียง/จอ)": <IconCup />,
  "กล้องวงจรปิด": <IconCamSmall />,
};

const MONEY_ICON = "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbc8b22cedfbb4640a702f724881f196d?format=webp&width=800";
const SCAN_ICON = "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb8992da4be824b339d3df5f0a076ed93?format=webp&width=800";

const DEFAULT_COLORS = [
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5456dc0212c14ba6a327d537ceed405e?format=webp&width=800", // c1
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F60613c947767482aa9d75e7414cdf10a?format=webp&width=800", // c2
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F257808683b104f7fb4c3d4ba712b4ef0?format=webp&width=800", // c3
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc1540ee8e580442bbcfe1c7cbf7ca0ca?format=webp&width=800", // c4
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F31b9a82b697a46a6b5b14e32002472d8?format=webp&width=800", // c5
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcae7472130bc47f09f28af725a944548?format=webp&width=800", // c6
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F117b0cdb42744374a5999f03625d56aa?format=webp&width=800", // c7
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fee9ba92b67734653865abb9c651119d6?format=webp&width=800", // c8
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ffae13b859b7c45eba3e49272be7622d2?format=webp&width=800", // c9
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9ba49f215d7d4abca6a601bdee2d7bd5?format=webp&width=800", // c10
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F30bc6908a9fc4a9e96afd58e5885af1b?format=webp&width=800", // c11
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F321fa0e9571a4e34b5fe6beffc1fbbed?format=webp&width=800", // c12
];

const DesignScreen: React.FC = () => {
  const navigate = useNavigate();
  const [color, setColor] = useState<string>(DEFAULT_COLORS[0]);
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
      sessionStorage.setItem("design.color", color);
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
              extra: "รถเมล์รุ่นพิเศษ 51+ ที่นั่ง",
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
                <HeroWithShadow>
                  <div className="relative">
                    {/* color tint overlay + selected amenities/payments */}
                    {(() => {
                      const amenities = (() => { try { const raw = sessionStorage.getItem('design.amenities'); return raw ? JSON.parse(raw) as string[] : []; } catch { return [] as string[]; } })();
                      const payments = (() => { try { const raw = sessionStorage.getItem('design.payment'); return raw ? JSON.parse(raw) as string[] : []; } catch { return [] as string[]; } })();
                      const doorsRaw = (() => { try { const raw = sessionStorage.getItem('design.doors'); return raw ? (JSON.parse(raw) as any) : raw ? String(raw) : null; } catch { return sessionStorage.getItem('design.doors'); } })();
                      const overlayLabels: string[] = [...(amenities||[]), ...(payments||[])];
                      if (doorsRaw) overlayLabels.push(typeof doorsRaw === 'string' ? doorsRaw : doorsRaw.doorChoice || (doorsRaw.hasRamp ? 'ramp' : doorsRaw.highLow ? 'emergency' : ''));

                      return (
                        <>
                          {/* tint overlay */}
                          {color && (
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 pointer-events-none rounded-md"
                              style={{
                                backgroundImage: `url(${color})`,
                                backgroundSize: 'cover',
                                mixBlendMode: 'multiply',
                                opacity: 0.9,
                              }}
                            />
                          )}

                          {/* small icons row */}
                          {overlayLabels.length > 0 && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 flex flex-wrap justify-center gap-2 z-20 max-w-[80%]">
                              {overlayLabels.map((lab, i) => {
                                if (AMENITIES_ICON_MAP[lab]) return (
                                  <div key={`${lab}-${i}`} className="bg-white/90 backdrop-blur rounded-full p-1 shadow-md h-8 w-8 flex items-center justify-center">{AMENITIES_ICON_MAP[lab]}</div>
                                );
                                if (lab === 'เงินสด') return <div key={lab+i} className="bg-white/90 backdrop-blur rounded-full p-1 shadow-md h-8 w-8 flex items-center justify-center"><img src={MONEY_ICON} alt={lab} className="h-5 w-5 object-contain"/></div>;
                                if (lab === 'สแกนจ่าย') return <div key={lab+i} className="bg-white/90 backdrop-blur rounded-full p-1 shadow-md h-8 w-8 flex items-center justify-center"><img src={SCAN_ICON} alt={lab} className="h-5 w-5 object-contain"/></div>;
                                if (lab === '1' || lab === '2' || lab === 'ramp' || lab === 'emergency') return <div key={lab+i} className="bg-white/90 backdrop-blur rounded-full p-1 shadow-md h-8 w-8 flex items-center justify-center text-xs">{String(lab)}</div>;
                                return <div key={lab+i} className="bg-white/90 backdrop-blur rounded-full p-1 shadow-md h-8 w-8 flex items-center justify-center text-xs">?</div>;
                              })}
                            </div>
                          )}
                        </>
                      );
                    })()}

                    <img
                      src={img}
                      alt={`ภาพรถ - ${label}`}
                      className="h-72 w-auto object-contain select-none relative z-10"
                      decoding="async"
                      loading="eager"
                    />
                  </div>
                </HeroWithShadow>
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
              colors={DEFAULT_COLORS}
              selectedColor={color}
              onColorSelect={setColor}
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
