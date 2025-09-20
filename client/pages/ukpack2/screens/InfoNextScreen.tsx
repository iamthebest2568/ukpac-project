import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SummaryDetails from "../components/SummaryDetails";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";

const InfoNextScreen: React.FC = () => {
  const navigate = useNavigate();
  const [designData, setDesignData] = useState<Record<string, any>>({});

  useEffect(() => {
    const data: Record<string, any> = {};
    try {
      const chassis = sessionStorage.getItem("design.chassis");
      const seating = sessionStorage.getItem("design.seating");
      const amenities = sessionStorage.getItem("design.amenities");
      const payment = sessionStorage.getItem("design.payment");
      const doors = sessionStorage.getItem("design.doors");
      const color = sessionStorage.getItem("design.color");
      const slogan = sessionStorage.getItem("design.slogan");

      if (chassis) data.chassis = chassis;
      if (seating) data.seating = seating ? JSON.parse(seating) : undefined;
      if (amenities)
        data.amenities = amenities ? JSON.parse(amenities) : undefined;
      if (payment) data.payment = payment ? JSON.parse(payment) : undefined;
      if (doors) data.doors = doors ? JSON.parse(doors) : undefined;
      if (color) data.color = color;
      if (slogan) data.slogan = slogan;
    } catch (e) {}
    setDesignData(data);
  }, []);

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

  const selected = (() => {
    try {
      return (
        (designData.chassis as string) ||
        sessionStorage.getItem("design.chassis") ||
        "medium"
      );
    } catch (e) {
      return "medium";
    }
  })();

  const chassisLabel = CHASSIS_LABELS[selected] || "";
  const heroImg = HERO_IMAGE[selected];

  return (
    <CustomizationScreen title="" theme="light" footerContent={
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex flex-col items-stretch gap-3 w-full max-w-sm p-4 md:p-6 mx-auto">
            <div className="w-full">
              <SecondaryButton
                text="ใช้บริการแน่นอน"
                onClick={() => navigate("/ukpack2/thank-you")}
                className="w-full"
              />
            </div>
            <div className="w-full">
              <CtaButton
                text="ไม่แน่ใจ"
                onClick={() => navigate("/ukpack2/feedback")}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    }>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Top header image (75% width centered) */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-[75%] mx-auto px-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8252bd27b98340349ac37000716c83db?format=webp&width=800"
              alt="header image"
              className="w-full h-auto object-contain rounded-b-xl max-h-[220px] md:max-h-[360px] mx-auto"
              style={{ objectPosition: 'center' }}
            />
          </div>
        </div>

        {/* Hero bus display with overlay icons */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-full max-w-[900px] relative h-[140px] md:h-[200px] flex items-center justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe0d645d03e674262a48ecc18869e1901?format=webp&width=1600"
              alt="bg"
              className="absolute inset-0 mx-auto h-full object-contain rounded-xl pointer-events-none select-none"
              style={{ objectPosition: 'center 45%', maxWidth: 560, zIndex: 0 }}
              decoding="async"
              loading="eager"
            />

            <div className="absolute left-1/2 top-[48%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto" style={{ width: '72%', maxWidth: 420, zIndex: 120 }}>
              {(() => {
                const amenities = (() => {
                  try { const raw = sessionStorage.getItem("design.amenities"); return raw ? (JSON.parse(raw) as string[]) : []; } catch { return [] as string[]; }
                })();
                const payments = (() => {
                  try { const raw = sessionStorage.getItem("design.payment"); return raw ? (JSON.parse(raw) as string[]) : []; } catch { return [] as string[]; }
                })();
                const doors = (() => {
                  try { const raw = sessionStorage.getItem("design.doors"); if (!raw) return null; const parsed = JSON.parse(raw); return typeof parsed === "string" ? parsed : parsed?.doorChoice || (parsed?.hasRamp ? "ramp" : parsed?.highLow ? "emergency" : null); } catch { return sessionStorage.getItem("design.doors"); }
                })();
                const overlay = [ ...(amenities || []), ...(payments || []), ...(doors ? [doors as string] : []) ];
                const ICONS: Record<string, string> = {
                  เงินสด: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbc8b22cedfbb4640a702f724881f196d?format=webp&width=800",
                  สแกนจ่าย: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb8992da4be824b339d3df5f0a076ed93?format=webp&width=800",
                  "สแกนจ่าย 2": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F56620e798eb94153b2390271f30d0dae?format=webp&width=800",
                  แตะบัตร: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdb2e47a586b841d1af014e9196f3c411?format=webp&width=800",
                  กระเป๋ารถเมล์: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F41c089c5dd4b448993c4e02c02cdf7ac?format=webp&width=800",
                  "ตั๋วรายเดือน/รอบ": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fca6467eff0c74a77a8e5757f25a24e41?format=webp&width=800",
                  "1": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9811f9bca05c43feae9eafdcbab3c8d9?format=webp&width=800",
                  "2": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8f9b21942af243b3b80b0e5ac8b12631?format=webp&width=800",
                  ramp: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fece2b6fc843340f0997f2fd7d3ca0aea?format=webp&width=800",
                  emergency: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F98de0624be3d4ae6b96d83edcf8891f9?format=webp&width=800",
                };
                return overlay.length > 0 ? (
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-2 max-w-[80%]" style={{ zIndex: 130, top: '10%' }}>
                    {overlay.map((lab, i) => (
                      <div key={`${lab}-${i}`} className="bg-white/95 backdrop-blur rounded-full h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10">
                        {ICONS[lab] ? <img src={ICONS[lab]} alt={lab} className="h-6 w-6 md:h-7 md:w-7 object-contain" /> : <div className="text-xs">{lab}</div>}
                      </div>
                    ))}
                  </div>
                ) : null;
              })()}

              <img
                src={heroImg}
                alt={chassisLabel}
                className="w-full h-auto object-contain select-none"
                style={{ position: 'relative', zIndex: 50 }}
                decoding="async"
                loading="eager"
              />
            </div>
          </div>
        </div>

        <SummaryDetails />

        <p className="mt-4 font-sarabun font-bold text-[#003366] text-center">
          <span>ถ้ามีรถประจำทางแบบนี้คุณคิด</span>
          <br />
          <span>ว่าจะใช้บริการหรือไม่</span>
        </p>
      </div>
    </CustomizationScreen>
  );
};

export default InfoNextScreen;
