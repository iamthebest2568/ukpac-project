import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import ConfirmModal from "../components/ConfirmModal";
import { HERO_IMAGE, CHASSIS_LABELS } from "../utils/heroImages";

const InfoScreen: React.FC = () => {
  const navigate = useNavigate();

  const [isExitModalOpen, setExitModalOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const selected = React.useMemo(() => {
    try {
      return sessionStorage.getItem("design.chassis") || "medium";
    } catch (e) {
      return "medium";
    }
  }, []);
  const selectedLabel = CHASSIS_LABELS[selected] || "";

  // prefer persisted final image when available (set by DesignScreen) so visuals remain consistent
  const persistedFinal = (() => {
    try {
      const raw = sessionStorage.getItem("design.finalImage");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  })();

  const effectiveHero = persistedFinal?.imageSrc || HERO_IMAGE[selected];

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
              src={effectiveHero}
              alt="image"
              className="w-full h-auto object-contain rounded-b-xl max-h-[220px] md:max-h-[360px] mx-auto"
              style={{ objectPosition: "center" }}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="w-full flex justify-center mt-6 md:mt-10">
            <div className="w-full max-w-[900px] relative h-[140px] md:h-[200px] flex items-center justify-center">
              <img
                src={effectiveHero}
                alt="image"
                className="absolute inset-0 mx-auto h-full object-contain rounded-xl pointer-events-none select-none"
                style={{
                  objectPosition: "center 45%",
                  maxWidth: 560,
                  zIndex: 0,
                }}
                decoding="async"
                loading="eager"
              />

              <div
                className="absolute left-1/2 top-[48%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto"
                style={{ width: "72%", maxWidth: 420, zIndex: 120 }}
              >
                {(() => {
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
                  const doors = (() => {
                    try {
                      const raw = sessionStorage.getItem("design.doors");
                      if (!raw) return null;
                      const parsed = JSON.parse(raw);
                      return typeof parsed === "string"
                        ? parsed
                        : parsed?.doorChoice ||
                            (parsed?.hasRamp
                              ? "ramp"
                              : parsed?.highLow
                                ? "emergency"
                                : null);
                    } catch {
                      return sessionStorage.getItem("design.doors");
                    }
                  })();
                  const overlay = [
                    ...(amenities || []),
                    ...(payments || []),
                    ...(doors ? [doors as string] : []),
                  ];

                  // Build merged overlay map: prefer stored session URLs, then canonical OVERLAY_ICON_SRC, then AMENITIES_ICON_MAP nodes
                  let storedMapRaw: Record<string, string> = {};
                  try {
                    const raw = sessionStorage.getItem("design.overlayIconMap");
                    if (raw)
                      storedMapRaw = JSON.parse(raw) as Record<string, string>;
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
                  const setVariants = (
                    key: string,
                    val: string | React.ReactNode,
                  ) => {
                    merged[key] = val;
                    try {
                      const nk = normalizeKey(key as string);
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
                    const {
                      OVERLAY_ICON_SRC,
                    } = require("../utils/overlayIcons");
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
                    <div
                      className="absolute left-1/2 transform -translate-x-1/2 flex items-center w-[80%]"
                      style={{ zIndex: 130, top: "10%" }}
                    >
                      <button
                        type="button"
                        aria-label="Prev overlay"
                        onClick={() => {
                          try {
                            const el = scrollRef.current;
                            if (el)
                              el.scrollBy({
                                left: -el.clientWidth * 0.6,
                                behavior: "smooth",
                              });
                          } catch (e) {}
                        }}
                        className="p-2 rounded-full mr-2 text-[#003366]"
                      >
                        ‹
                      </button>

                      <div
                        ref={scrollRef}
                        className="flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap items-center py-1 mx-2"
                        style={{ scrollBehavior: "smooth" }}
                      >
                        {overlay.map((lab, i) => {
                          const srcOrNode =
                            merged[lab] ??
                            merged[normalizeKey(lab)] ??
                            merged[normalizeKey(lab).replace(/\s/g, "")];
                          return (
                            <div
                              key={`${lab}-${i}`}
                              className="inline-flex items-center justify-center h-9 w-9 md:h-10 md:w-10"
                              style={{ flex: "0 0 auto" }}
                            >
                              {typeof srcOrNode === "string" ? (
                                <img
                                  src={srcOrNode as string}
                                  alt={lab}
                                  className="h-full w-full object-contain"
                                />
                              ) : srcOrNode ? (
                                // if it's a JSX node (Icon component), wrap in container to size it
                                <div className="h-full w-full flex items-center justify-center">
                                  {srcOrNode}
                                </div>
                              ) : (
                                <div className="text-xs">{lab}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        aria-label="Next overlay"
                        onClick={() => {
                          try {
                            const el = scrollRef.current;
                            if (el)
                              el.scrollBy({
                                left: el.clientWidth * 0.6,
                                behavior: "smooth",
                              });
                          } catch (e) {}
                        }}
                        className="p-2 rounded-full ml-2 text-[#003366]"
                      >
                        ›
                      </button>
                    </div>
                  ) : null;
                })()}
                <img
                  src={effectiveHero}
                  alt={selectedLabel}
                  className="w-full h-auto object-contain select-none"
                  style={{ position: "relative", zIndex: 50 }}
                  decoding="async"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 md:px-8 max-w-[900px] mx-auto">
            {selected === "small" ? (
              <div className="bg-[#e6e7e8] rounded-xl p-4 text-[#001a73] font-sarabun">
                <h2 className="font-sarabun font-semibold text-xl text-center">
                  รู้หรือไม่!
                </h2>
                <p>
                  ในญี่ปุ่นมี Community Bus
                  รถเมล์ขนาดเล็กที่วิ่งเข้าซอยและพื้นที่ ที่รถใหญ่เข้าไม่ถึง
                  ค่าโดยสารถูกมาก บางแห่งนั่งได้ทั้งสาย เพียง 100 เยน
                  ทำให้ผู้สูงอายุและเด็กเข้าถึงบริการสำคัญ เช่น
                  โรงพยาบาลและศูนย์ชุมชนได้สะดวกขึ้น
                </p>
              </div>
            ) : selected === "extra" ? (
              <div className="bg-[#e6e7e8] rounded-xl p-4 text-[#001a73] font-sarabun">
                <h2 className="font-sarabun font-semibold text-xl text-center">
                  รู้หรือไม่!
                </h2>
                <p>
                  ฟิลิปปินส์ – Jeepney Modernization รู้หรือไม่! ฟิลิปปินส์พัฒนา
                  Jeepney แบบดั้งเดิมให้กลายเป็นมินิบัสขนาด 20–25
                  ที่นั่งที่ปลอดภัยและลดมลพิษกว่าเดิม
                  การเปลี่ยนโฉมนี้ยังคงค่าโดยสารถูก เหมาะกับคนเมือง
                  และช่วยลดปัญหาสิ่งแวดล้อมไปพร้อมกัน
                </p>
              </div>
            ) : selected === "large" ? (
              <div className="bg-[#e6e7e8] rounded-xl p-4 text-[#001a73] font-sarabun">
                <h2 className="font-sarabun font-semibold text-xl text-center">
                  รู้หรือไม่!
                </h2>
                <p>
                  เคนยา – Matatu Minibus รู้หรือไม่! ในไนโรบีมี Matatu
                  รถตู้โดยสาร 14–30 ที่นั่งที่วิ่งยืดหยุ่นตามผู้โดยสาร
                  แม้จะวุ่นวาย
                  แต่ก็เป็นทางเลือกการเดินทางราคาถูกที่เข้าถึงทุกพื้นที่
                  ทำให้คนทุกระดับรายได้มีโอกาสเดินทางสะดวก
                </p>
              </div>
            ) : (
              <div className="bg-[#e6e7e8] rounded-xl p-4 text-[#001a73] font-sarabun">
                <h2 className="font-sarabun font-semibold text-xl text-center">
                  รู้หรือไม่!
                </h2>
                <p>
                  ในญี่ปุ่นมี Community Bus
                  รถเมล์ขนาดเล็กที่วิ่งเข้าซอยและพื้นที่ ที่รถใหญ่เข้าไม่ถึง
                  ค่าโดยสารถูกมาก บางแห่งนั่งได้ทั้งสาย เพียง 100 เยน
                  ทำให้ผู้สูงอายุและเด็กเข้าถึงบริการสำคัญ เช่น
                  โรงพยาบาลและศูนย์ชุมชนได้สะดวกขึ้น
                </p>
              </div>
            )}
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
