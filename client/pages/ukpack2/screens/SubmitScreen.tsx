import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import { useBusDesign } from "../context/BusDesignContext";
import ConfirmModal from "../components/ConfirmModal";
import VehiclePreview from "../components/VehiclePreview";

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
  const [route, setRoute] = useState("");
  const [area, setArea] = useState("");
  const [isExitModalOpen, setExitModalOpen] = useState(false);

  const { state, dispatch, submitDesignToFirebase } = useBusDesign() as any;

  // chassis labels and images (same mapping as DesignScreen)
  const CHASSIS_LABELS: Record<string, string> = {
    small: "รถเมล์ขนาดเล็ก 16–30 ที่นั่ง",
    medium: "รถเมล์มาตรฐาน 30–50 ที่นั่ง",
    large: "รถตู้โดยสาร 9–15 ที่นั่ง",
    extra: "รถกะบะดัดแปลง 8–12 ที่นั่ง",
  };
  const HERO_IMAGE: Record<string, string> = {
    small:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F20092528ba1e4f2eb4562515ccb6f75a?format=webp&width=800",
    medium:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbcd1013232914b39b73ebd2bd35d7bbd?format=webp&width=800",
    large:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F297c5816ab8c4adeb3cc73b6f66ab9e0?format=webp&width=800",
    extra:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8b4be3122d774f95b4c5e5bde1cd7c49?format=webp&width=800",
  };

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
    const submitData = { interval, route, area };
    try {
      sessionStorage.setItem("design.submit", JSON.stringify(submitData));
    } catch (e) {}

    // update context service info synchronously
    try {
      if (dispatch) {
        dispatch({
          type: "SET_SERVICE_INFO",
          payload: { routeName: route, area, frequency: interval },
        });
      }
    } catch (e) {}

    // Fire-and-forget submission to Firebase, but navigate immediately so UI isn't blocked
    try {
      submitDesignToFirebase({
        ...(state || {}),
        serviceInfo: { routeName: route, area, frequency: interval },
      }).catch(() => {});
    } catch (e) {}

    navigate("/ukpack2/summary");
  };

  const chassisLabel = CHASSIS_LABELS[selectedChassis] || "";
  const heroImg = HERO_IMAGE[selectedChassis];

  const storedColor = state?.exterior?.color || (() => {
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
        title="ปรับแต่งรถเมล์ของคุณ"
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
                colorFilter={storedColor?.filter}
                label={
                  <>
                    <span className="chassis-label-mobile">รถที่เลือก : </span>
                    {chassisLabel}
                  </>
                }
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
                  กระเป๋ารถเมล์: BUS_EMPLOY_ICON,
                }}
              />
            </div>
          ) : null}

          {/* divider between vehicle preview and content */}
          <div className="my-4 flex justify-center">
            <div className="w-11/12 max-w-[720px] h-1 bg-[#000D59] rounded-full" style={{ height: 6 }} />
          </div>

          <h2 className="text-lg font-prompt font-semibold text-[#003366] mt-2">
            การบริการของรถเมล์
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3 min-w-0">
              <label className="w-28 md:w-36 text-sm text-[#003366] truncate" style={{ fontFamily: 'Sarabun, sans-serif', fontSize: '17.6px' }}>
                รถจะมาทุก
              </label>
              <input
                type="text"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="flex-1 min-w-0 max-w-[220px] md:max-w-none rounded-xl px-3 py-1.5 md:py-2 border-2 border-[#000D59] h-9 md:h-auto"
              />
              <span className="w-12 text-sm text-[#003366]" style={{ fontFamily: 'Sarabun, sans-serif', fontSize: '17.6px' }}>นาที</span>
            </div>

            <div className="flex items-start gap-3 min-w-0">
              <label className="w-28 md:w-36 text-sm text-[#003366] truncate" style={{ fontFamily: 'Sarabun, sans-serif', fontSize: '17.6px' }}>
                สายรถ���มล์
              </label>
              <textarea
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                placeholder="พิมพ์"
                className="flex-1 min-w-0 max-w-[220px] md:max-w-none rounded-xl px-3 py-2 border-2 border-[#000D59] h-24 md:h-auto resize-none"
                style={{ fontFamily: 'Sarabun, sans-serif', fontSize: '17.6px' }}
              />
            </div>

            <div className="flex items-start gap-3 min-w-0">
              <label className="w-28 md:w-36 text-sm text-[#003366] truncate" style={{ fontFamily: 'Sarabun, sans-serif', fontSize: '17.6px' }}>
                พื้นที่ที่วิ่ง
              </label>
              <textarea
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="พิมพ์"
                className="flex-1 min-w-0 max-w-[220px] md:max-w-none rounded-xl px-3 py-2 border-2 border-[#000D59] h-24 md:h-auto resize-none"
                style={{ fontFamily: 'Sarabun, sans-serif', fontSize: '17.6px' }}
              />
            </div>
          </div>
        </div>
      </CustomizationScreen>

      <ConfirmModal
        isOpen={isExitModalOpen}
        title="ออ��จากหน้าจอ"
        message="คุณแน่ใจหรือไม่ว่าต้องการออก? การเปลี่ยนแปลงของคุณจะไม่ถูกบันทึก"
        onConfirm={() => navigate("/")}
        onCancel={() => setExitModalOpen(false)}
      />
    </>
  );
};

export default SubmitScreen;
