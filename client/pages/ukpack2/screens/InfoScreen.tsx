import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import ConfirmModal from "../components/ConfirmModal";

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

const InfoScreen: React.FC = () => {
  const navigate = useNavigate();

  const [isExitModalOpen, setExitModalOpen] = React.useState(false);

  const selected = React.useMemo(() => {
    try {
      return sessionStorage.getItem("design.chassis") || "medium";
    } catch (e) {
      return "medium";
    }
  }, []);
  const selectedLabel = CHASSIS_LABELS[selected] || "";

  return (
    <>
      <CustomizationScreen
        theme="light"
        fullWidth
        footerContent={
          <div className="flex justify-center">
            <CtaButton
              text="ไปต่อ"
              onClick={() => navigate("/ukpack2/info-next")}
            />
          </div>
        }
      >
        <div className="w-full flex justify-center">
          <div className="w-[75%] mx-auto px-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8252bd27b98340349ac37000716c83db?format=webp&width=800"
              alt="image"
              className="w-full h-auto object-contain rounded-b-xl max-h-[220px] md:max-h-[360px] mx-auto"
              style={{ objectPosition: 'center' }}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="w-full flex justify-center mt-6 md:mt-10">
            <div className="w-full max-w-[900px] relative h-[140px] md:h-[200px] flex items-center justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe0d645d03e674262a48ecc18869e1901?format=webp&width=1600"
                alt="image"
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

                  // Build merged overlay map: prefer stored session URLs, then canonical OVERLAY_ICON_SRC, then AMENITIES_ICON_MAP nodes
                  let storedMapRaw: Record<string, string> = {};
                  try {
                    const raw = sessionStorage.getItem("design.overlayIconMap");
                    if (raw) storedMapRaw = JSON.parse(raw) as Record<string, string>;
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
                  const setVariants = (key: string, val: string | React.ReactNode) => {
                    merged[key] = val;
                    try {
                      const nk = normalizeKey(key as string);
                      if (nk) merged[nk] = val;
                      const nkNoSpace = nk.replace(/\s/g, "");
                      if (nkNoSpace) merged[nkNoSpace] = val;
                    } catch {}
                  };

                  for (const k of Object.keys(storedMapRaw)) {
                    try { setVariants(k, storedMapRaw[k]); } catch {}
                  }

                  try {
                    const { OVERLAY_ICON_SRC } = require("../utils/overlayIcons");
                    for (const k of Object.keys(OVERLAY_ICON_SRC)) {
                      if (!merged[k]) setVariants(k, OVERLAY_ICON_SRC[k]);
                    }
                  } catch {}

                  // include AMENITIES_ICON_MAP JSX nodes as fallback
                  try {
                    for (const k of Object.keys(AMENITIES_ICON_MAP)) {
                      if (!merged[k]) setVariants(k, AMENITIES_ICON_MAP[k]);
                    }
                  } catch {}

                  return overlay.length > 0 ? (
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-2 max-w-[80%]" style={{ zIndex: 130, top: '10%' }}>
                      {overlay.map((lab, i) => {
                        const srcOrNode = merged[lab] ?? merged[normalizeKey(lab)] ?? merged[normalizeKey(lab).replace(/\s/g, "")];
                        return (
                          <div key={`${lab}-${i}`} className="bg-white/95 backdrop-blur rounded-full h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10">
                            {typeof srcOrNode === 'string' ? (
                              <img src={srcOrNode as string} alt={lab} className="h-6 w-6 md:h-7 md:w-7 object-contain" />
                            ) : srcOrNode ? (
                              <>{srcOrNode}</>
                            ) : (
                              <div className="text-xs">{lab}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : null;
                })()}
                <img
                  src={HERO_IMAGE[selected]}
                  alt={selectedLabel}
                  className="w-full h-auto object-contain select-none"
                  style={{ position: 'relative', zIndex: 50 }}
                  decoding="async"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 md:px-8 max-w-[900px] mx-auto">
            <div className="bg-[#e6e7e8] rounded-xl p-4 text-[#001a73] font-sarabun">
              <h2 className="font-sarabun font-semibold text-xl text-center">รู้หรือไม่!</h2>
              <p>
                ในญี่ปุ่นมี Community Bus รถเมล์ขนาดเล็กที่วิ่งเข้าซอยและพื้นที่
                ที่รถใหญ่เข้าไม่ถึง ค่าโดยสารถูกมาก บางแห่งนั่งได้ทั้งสา��เพียง 100
                เยน ทำให้ผู้สูงอายุและเด็กเข้าถึงบริการสำคัญ เช่น
                โรงพยาบาลและศูนย์ชุมชนได้สะดวกขึ้น
              </p>
            </div>
          </div>
        </div>
      </CustomizationScreen>

      <ConfirmModal
        isOpen={isExitModalOpen}
        title="ออกจากหน้าจอ"
        message="คุณแน่ใจหรือไม่ว่าต้องการออก? การเปลี่ยนแปลงของคุณจะไม่ถูกบันทึก"
        onConfirm={() => navigate("/")}
        onCancel={() => setExitModalOpen(false)}
      />
    </>
  );
};

export default InfoScreen;
