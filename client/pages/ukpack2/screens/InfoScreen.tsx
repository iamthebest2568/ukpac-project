import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import ConfirmModal from "../components/ConfirmModal";
import { HERO_IMAGE, CHASSIS_LABELS } from "../utils/heroImages";
import VehiclePreview from "../components/VehiclePreview";
import Uk2Footer from "../components/Uk2Footer";
import styles from "./chassis.module.css";
import { saveMinigameResult, addDesignImageUrlToFirestore } from "../../../lib/firebase";

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

  React.useEffect(() => {
    let cancelled = false;
    async function composeAndUpload() {
      try {
        const chassis = persistedFinal?.chassis || selected || "medium";
        const key = `mydreambus_design_image_sent_${chassis}`;
        try {
          const existing = sessionStorage.getItem(key);
          if (existing) return; // already uploaded
        } catch (_) {}

        const baseSrc = persistedFinal?.imageSrc || HERO_IMAGE[chassis];
        const maskSrc = persistedFinal?.colorMaskSrc || null;
        const colorHex = persistedFinal?.color?.colorHex || (() => {
          try { const raw = sessionStorage.getItem("design.color"); return raw ? (JSON.parse(raw)?.colorHex || null) : null; } catch { return null; }
        })();

        const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = (e) => reject(e);
          img.src = src;
        });

        const baseImg = await loadImage(baseSrc);
        const width = baseImg.naturalWidth || 800;
        const height = baseImg.naturalHeight || 600;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported");
        ctx.drawImage(baseImg, 0, 0, width, height);

        if (maskSrc && colorHex) {
          try {
            const maskImg = await loadImage(maskSrc);
            const colorCanvas = document.createElement("canvas");
            colorCanvas.width = width;
            colorCanvas.height = height;
            const cctx = colorCanvas.getContext("2d");
            if (cctx) {
              cctx.fillStyle = colorHex;
              cctx.fillRect(0, 0, width, height);
              cctx.globalCompositeOperation = "destination-in";
              cctx.drawImage(maskImg, 0, 0, width, height);
              cctx.globalCompositeOperation = "source-over";
              ctx.drawImage(colorCanvas, 0, 0, width, height);
            }
          } catch (e) {
            console.warn("InfoScreen: apply mask failed", e);
          }
        }

        const blob: Blob | null = await new Promise((res) => {
          try { canvas.toBlob((b) => res(b), "image/png"); } catch (e) { res(null); }
        });
        if (!blob) {
          try {
            const r = await addDesignImageUrlToFirestore(baseSrc, "mydreambus-imagedesign-events");
            try { sessionStorage.setItem(key, JSON.stringify({ id: r.id || null, url: baseSrc })); } catch (_) {}
          } catch (e) {
            console.warn("InfoScreen: fallback write image url failed", e);
          }
          return;
        }

        let userId: string | null = null;
        try {
          const { getAuth } = await import("firebase/auth");
          const auth = getAuth();
          if (auth && (auth as any).currentUser) userId = (auth as any).currentUser.uid;
        } catch (_) {}

        try {
          const res = await saveMinigameResult(blob, colorHex || null, userId);
          const url = (res as any).url || null;
          try { sessionStorage.setItem(key, JSON.stringify({ id: (res as any).docId || null, url })); } catch (_) {}
        } catch (e) {
          console.warn("InfoScreen: saveMinigameResult failed, attempting fallback", e);
          try {
            const uploaded = await addDesignImageUrlToFirestore(baseSrc, "mydreambus-imagedesign-events");
            try { sessionStorage.setItem(key, JSON.stringify({ id: uploaded.id || null, url: baseSrc })); } catch (_) {}
          } catch (e2) {
            console.warn("InfoScreen: fallback addDesignImageUrlToFirestore failed", e2);
          }
        }
      } catch (e) {
        console.warn("InfoScreen: composeAndUpload failed", e);
      }
    }
    composeAndUpload();
    return () => { cancelled = true; };
  }, [persistedFinal, selected]);

  return (
    <>
      <CustomizationScreen
        theme="light"
        fullWidth
        footerContent={
          <Uk2Footer>
            <div className="w-full flex justify-center">
              <CtaButton
                text="ไปต่อ"
                onClick={() => navigate("/mydreambus/info-next")}
              />
            </div>
          </Uk2Footer>
        }
      >
        <div
          className={`${styles.previewInner} mx-auto px-4 py-2 flex justify-center`}
        >
          <div className="w-[75%] mx-auto px-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8252bd27b98340349ac37000716c83db?format=webp&width=800"
              alt="image"
              className="w-full h-auto object-contain rounded-b-xl max-h-[220px] md:max-h-[360px] mx-auto"
              style={{ objectPosition: "center" }}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="w-full flex justify-center mt-4 md:mt-6">
            <div className="w-full max-w-[900px] relative h-[140px] md:h-[200px] flex items-center justify-center">
              {/* Use VehiclePreview so selected color overlays are applied when present */}
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

                const overlayLabels = [
                  ...(amenities || []),
                  ...(payments || []),
                  ...(doors ? [doors as string] : []),
                ];

                // stored overlay map
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
                  const { OVERLAY_ICON_SRC } = require("../utils/overlayIcons");
                  for (const k of Object.keys(OVERLAY_ICON_SRC)) {
                    if (!merged[k]) setVariants(k, OVERLAY_ICON_SRC[k]);
                  }
                } catch {}

                // parse selected color
                let effectiveColorHex: string | null = null;
                let effectiveColorMaskSrc: string | null = null;
                try {
                  const raw = sessionStorage.getItem("design.color");
                  if (raw) {
                    const parsed = JSON.parse(raw);
                    effectiveColorHex = parsed?.colorHex || null;
                    effectiveColorMaskSrc =
                      parsed?.colorMaskSrc || parsed?.mask || null;
                  }
                } catch {}

                return (
                  <div className="w-full">
                    <VehiclePreview
                      imageSrc={effectiveHero}
                      label={selectedLabel}
                      overlayLabels={overlayLabels}
                      overlayIconMap={merged}
                      colorHex={effectiveColorHex}
                      colorMaskSrc={effectiveColorMaskSrc}
                      showSelectedText={true}
                      className="w-full"
                    />
                  </div>
                );
              })()}
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
                  ที่นั่งที่ปลอดภยและลดมลพิษกว่าเดิม
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
                  รถตู้โดยสาร 14–30 ที่นั่งที่วิ่งยืดหยุ่นตามผู้โดยสา��
                  แม้จะวุ่นวาย
                  แต่ก็เป็นทางเลือกการเดินทางราคาถูกที่เข้าถึงทุกพื้นที่
                  ทำให้คนทุกระดับรายได้มีโอกาสเดิทางสะดวก
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
                  ทำให้ผู้สูงอายุ��ละเด็กเข้าถึงบริการสำคัญ เช่น
                  โรงพยาบาลและศู��ย์ชุมชนได้สะดวกขึ้น
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
