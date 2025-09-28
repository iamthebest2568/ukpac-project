import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import { useBusDesign } from "../context/BusDesignContext";
import ConfirmModal from "../components/ConfirmModal";
import VehiclePreview from "../components/VehiclePreview";
import Uk2Footer from "../components/Uk2Footer";
import { HERO_IMAGE, CHASSIS_LABELS } from "../utils/heroImages";

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

const SubmitScreen: React.FC = () => {
  const navigate = useNavigate();
  const [interval, setInterval] = useState("");
  const [area, setArea] = useState("");
  const [isExitModalOpen, setExitModalOpen] = useState(false);

  const { state, dispatch, submitDesignToFirebase } = useBusDesign() as any;

  const selectedChassis =
    (state && state.chassis) ||
    (() => {
      try {
        return sessionStorage.getItem("design.chassis") || "medium";
      } catch (e) {
        return "medium";
      }
    })();

  const chassisLabel = CHASSIS_LABELS[selectedChassis] || "";
  const heroImg = HERO_IMAGE[selectedChassis];

  const handleFinish = () => {
    // Validate required numeric fields: interval and area
    if (interval === "" || Number.isNaN(Number(interval))) {
      window.alert("กรุณากรอกจำนวน (นาที) ของความถี่การมาของรถเป็นตัวเลข");
      return;
    }
    if (area === "") {
      window.alert("กรุณาระบุพื้นที่วิ่ง");
      return;
    }

    const submitData = { interval: Number(interval), area };
    try {
      sessionStorage.setItem("design.submit", JSON.stringify(submitData));
    } catch (e) {}

    // update context service info synchronously
    try {
      if (dispatch) {
        dispatch({
          type: "SET_SERVICE_INFO",
          payload: {
            routeName: null,
            area,
            frequency: Number(interval),
          },
        });
      }
    } catch (e) {}

    // Fire-and-forget submission to Firebase, but navigate immediately so UI isn't blocked
    try {
      (async () => {
        try {
          let blob: Blob | null = null;

          // Prefer a client-side rendered final image (mask + color overlay) stored in session
          const persistedFinalRaw = sessionStorage.getItem("design.finalImage");
          const persistedFinal = persistedFinalRaw
            ? JSON.parse(persistedFinalRaw)
            : null;

          async function loadImage(url: string) {
            return new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => resolve(img);
              img.onerror = (e) => reject(e);
              try {
                let finalUrl = String(url || "");
                // If absolute remote URL, route through server proxy to avoid CORS issues
                if (/^https?:\/\//i.test(finalUrl)) {
                  try {
                    const u = new URL(finalUrl);
                    const sameOrigin = window.location.hostname === u.hostname;
                    if (!sameOrigin) {
                      finalUrl = `/api/proxy-image?url=${encodeURIComponent(finalUrl)}`;
                    }
                  } catch (e) {}
                }
                img.src = finalUrl;
              } catch (e) {
                reject(e);
              }
            });
          }

          async function composeImage(): Promise<Blob | null> {
            try {
              const baseSrc = persistedFinal?.color?.preview || persistedFinal?.imageSrc || heroImg;
              if (!baseSrc) return null;
              const baseImg = await loadImage(baseSrc);
              const w = baseImg.naturalWidth || baseImg.width || 800;
              const h = baseImg.naturalHeight || baseImg.height || 400;

              const canvas = document.createElement("canvas");
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext("2d");
              if (!ctx) return null;

              // draw base image
              ctx.drawImage(baseImg, 0, 0, w, h);

              const colorHex = persistedFinal?.color?.colorHex || null;
              const maskSrc =
                persistedFinal?.colorMaskSrc ||
                persistedFinal?.colorMaskSrc ||
                null;

              if (colorHex) {
                if (maskSrc) {
                  try {
                    // create overlay with color
                    const overlayCanvas = document.createElement("canvas");
                    overlayCanvas.width = w;
                    overlayCanvas.height = h;
                    const octx = overlayCanvas.getContext("2d");
                    if (!octx) throw new Error("overlay ctx");

                    // fill with color
                    octx.fillStyle = colorHex;
                    octx.fillRect(0, 0, w, h);

                    // load mask and keep only masked area on overlay
                    const maskImg = await loadImage(maskSrc);
                    // Use destination-in to keep overlay where mask has alpha
                    octx.globalCompositeOperation = "destination-in";
                    octx.drawImage(maskImg, 0, 0, w, h);

                    // draw overlay onto main canvas using multiply blend to match preview
                    ctx.globalCompositeOperation = "multiply";
                    ctx.drawImage(overlayCanvas, 0, 0, w, h);

                    // reset composite op
                    ctx.globalCompositeOperation = "source-over";
                  } catch (e) {
                    // fallback: apply full-image tint
                    ctx.globalCompositeOperation = "multiply";
                    ctx.fillStyle = colorHex;
                    ctx.globalAlpha = 0.75;
                    ctx.fillRect(0, 0, w, h);
                    ctx.globalAlpha = 1;
                    ctx.globalCompositeOperation = "source-over";
                  }
                } else {
                  // No mask: apply full-image tint
                  ctx.globalCompositeOperation = "multiply";
                  ctx.fillStyle = colorHex;
                  ctx.globalAlpha = 0.75;
                  ctx.fillRect(0, 0, w, h);
                  ctx.globalAlpha = 1;
                  ctx.globalCompositeOperation = "source-over";
                }
              }

              // export to blob
              return await new Promise<Blob | null>((resolve) => {
                canvas.toBlob((b) => resolve(b), "image/png");
              });
            } catch (e) {
              console.warn("composeImage failed", e);
              return null;
            }
          }

          try {
            blob = await composeImage();
          } catch (e) {
            blob = null;
          }

          // fallback: if composing failed, fetch base hero image as blob
          if (!blob && heroImg) {
            try {
              let fetchUrl = heroImg;
              try {
                const u = new URL(String(heroImg));
                if (u.hostname !== window.location.hostname) {
                  fetchUrl = `/api/proxy-image?url=${encodeURIComponent(String(heroImg))}`;
                }
              } catch (e) {}
              const r = await fetch(fetchUrl);
              if (r.ok) blob = await r.blob();
            } catch (_) {
              blob = null;
            }
          }

          submitDesignToFirebase(
            {
              ...(state || {}),
              serviceInfo: {
                routeName: null,
                area: Number(area),
                frequency: Number(interval),
              },
            },
            blob,
          ).catch(() => {});
        } catch (_) {}
      })();
    } catch (e) {}

    navigate("/mydreambus/summary");
  };

  const storedColor =
    state?.exterior?.color ||
    (() => {
      try {
        const raw = sessionStorage.getItem("design.color");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

  return (
    <>
      <CustomizationScreen
        title="การบริการของรถเมล์"
        theme="light"
        footerContent={
          <Uk2Footer>
            <div className="w-full flex justify-center">
              <CtaButton text="ออกแบบเสร็จแล้ว" onClick={handleFinish} />
            </div>
          </Uk2Footer>
        }
      >
        <div className="space-y-6">
          {heroImg ? (
            <div className="flex flex-col items-center">
              <VehiclePreview
                imageSrc={heroImg}
                label={chassisLabel}
                showSelectedText
                overlayLabels={((): string[] => {
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
                  return [...(amenities || []), ...(payments || [])];
                })()}
                overlayIconMap={{
                  เงินสด: MONEY_ICON,
                  สแกนจ่าย: SCAN_ICON,
                  ตู้อั���โนมัติ: SCAN2_ICON,
                  แตะบัตร: TOUCH_ICON,
                  "ตั๋วรายเดือน/รอบ": MONTHLY_ICON,
                  กระเป๋ารถเมล์: BUS_EMPLOY_ICON,
                }}
              />
            </div>
          ) : null}

          {/* divider between vehicle preview and content */}
          <div className="my-4 flex justify-center">
            <div
              className="w-11/12 max-w-[720px] h-1 bg-[#000D59] rounded-full"
              style={{ height: 6 }}
            />
          </div>

          <h2 className="text-lg font-prompt font-semibold text-[#003366] mt-2">
            การบริการของรถเมล์
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3 min-w-0">
              <label
                className="w-28 md:w-36 text-sm text-[#003366] truncate"
                style={{
                  fontFamily: "Sarabun, sans-serif",
                  fontSize: "17.6px",
                  lineHeight: "1.2",
                  paddingTop: 6,
                  paddingBottom: 6,
                  overflow: "visible",
                }}
              >
                รถจะมา���ุกกี่นาที
              </label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="พิมพ์"
                value={interval}
                onChange={(e) =>
                  setInterval(e.target.value.replace(/[^0-9]/g, ""))
                }
                className="flex-1 min-w-0 max-w-[220px] rounded-xl px-3 py-1.5 border-2 border-[#000D59] h-9 text-center placeholder-gray-400"
                style={{
                  fontFamily: "Sarabun, sans-serif",
                  fontSize: "17.6px",
                  lineHeight: "1.2",
                  paddingTop: 6,
                  paddingBottom: 6,
                  overflow: "visible",
                }}
              />
              <span
                className="w-12 text-sm text-[#003366]"
                style={{
                  fontFamily: "Sarabun, sans-serif",
                  fontSize: "17.6px",
                  lineHeight: "1.2",
                  paddingTop: 6,
                  paddingBottom: 6,
                  overflow: "visible",
                }}
              >
                นาที
              </span>
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <label
                className="w-28 md:w-36 text-sm text-[#003366] truncate"
                style={{
                  fontFamily: "Sarabun, sans-serif",
                  fontSize: "17.6px",
                  lineHeight: "1.2",
                  paddingTop: 6,
                  paddingBottom: 6,
                  overflow: "visible",
                }}
              >
                พื้นที่วิ่ง
              </label>
              <input
                type="text"
                inputMode="text"
                placeholder="พิมพ์"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="flex-1 min-w-0 max-w-[220px] rounded-xl px-3 py-1.5 border-2 border-[#000D59] h-9 text-center placeholder-gray-400"
                style={{
                  fontFamily: "Sarabun, sans-serif",
                  fontSize: "17.6px",
                  lineHeight: "1.2",
                  paddingTop: 6,
                  paddingBottom: 6,
                  overflow: "visible",
                }}
              />
            </div>
          </div>
        </div>
      </CustomizationScreen>

      <ConfirmModal
        isOpen={isExitModalOpen}
        title="ออกจากหน้าจอ"
        message="คุณแน่ใจหรือไม่ว่าต้องการออก? การเปี่ยนแปลงของคุณจะไม่ถูกบันทึก"
        onConfirm={() => navigate("/")}
        onCancel={() => setExitModalOpen(false)}
      />
    </>
  );
};

export default SubmitScreen;
