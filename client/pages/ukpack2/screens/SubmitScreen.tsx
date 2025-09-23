import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import { useBusDesign } from "../context/BusDesignContext";
import ConfirmModal from "../components/ConfirmModal";
import VehiclePreview from "../components/VehiclePreview";
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
    state?.chassis ||
    (() => {
      try {
        return sessionStorage.getItem("design.chassis") || "medium";
      } catch (e) {
        return "medium";
      }
    })();

  const handleFinish = () => {
    // Validate required numeric fields: interval and area
    if (interval === "" || Number.isNaN(Number(interval))) {
      window.alert("กรุณากรอกจำนวน (นาที) ของความถี่การมาของรถเป็นตัวเลข");
      return;
    }
    if (area === "" || Number.isNaN(Number(area))) {
      window.alert("กรุณากรอกพื้นที่ที่วิ่งเป็นตัวเลข");
      return;
    }

    const submitData = { interval: Number(interval), area: Number(area) };
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
            area: Number(area),
            frequency: Number(interval),
          },
        });
      }
    } catch (e) {}

    // Fire-and-forget submission to Firebase, but navigate immediately so UI isn't blocked
    try {
      // attempt to fetch hero image and upload it as the representative image
      (async () => {
        try {
          let blob: Blob | null = null;
          if (heroImg) {
            try {
              const r = await fetch(heroImg);
              if (r.ok) blob = await r.blob();
            } catch (_) {}
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

    navigate("/ukpack2/summary");
  };

  const chassisLabel = CHASSIS_LABELS[selectedChassis] || "";
  const heroImg = HERO_IMAGE[selectedChassis];

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
        title="ออกแบบรถเมล์ของคุณ"
        theme="light"
        footerContent={
          <div className="flex justify-center">
            <CtaButton text="ออกแบบเสร็จแล้ว" onClick={handleFinish} />
          </div>
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
                  "สแกนจ่าย 2": SCAN2_ICON,
                  แตะบัตร: TOUCH_ICON,
                  "ตั๋วรายเดือน/รอบ": MONTHLY_ICON,
                  กระเป๋ารถเม���์: BUS_EMPLOY_ICON,
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
                รถจะมาทุกกี่นาที
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
                type="number"
                inputMode="numeric"
                placeholder="พิมพ์"
                value={area}
                onChange={(e) => setArea(e.target.value.replace(/[^0-9]/g, ""))}
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
        message="คุณแน่ใจหรือไม่ว่าต้องการออก? การเปลี่ยนแปลงของคุณจะไม่ถูกบันทึก"
        onConfirm={() => navigate("/")}
        onCancel={() => setExitModalOpen(false)}
      />
    </>
  );
};

export default SubmitScreen;
