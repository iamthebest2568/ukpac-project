import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import { useBusDesign } from "../context/BusDesignContext";
import ConfirmModal from "../components/ConfirmModal";
import HeroWithShadow from "../components/HeroWithShadow";

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
              <HeroWithShadow>
                <img
                  src={heroImg}
                  alt={`ภาพรถ - ${chassisLabel}`}
                  className="h-56 w-auto object-contain select-none"
                  decoding="async"
                  loading="eager"
                />
              </HeroWithShadow>
              <p className="mt-2 font-prompt font-semibold text-[#001a73] text-center">
                รถที่เลือก : {chassisLabel}
              </p>
            </div>
          ) : null}

          <h2 className="text-lg font-prompt font-semibold text-[#003366] mt-2">
            การบริการของรถเมล์
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="w-36 text-sm text-[#003366]">รถจะมาทุกๆ</label>
              <input
                type="text"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="flex-1 rounded-md px-3 py-2 border border-[#07204a]"
              />
              <span className="w-12 text-sm text-[#003366]">นาที</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="w-36 text-sm text-[#003366]">สายรถเมล์</label>
              <input
                type="text"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="flex-1 rounded-md px-3 py-2 border border-[#07204a]"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-36 text-sm text-[#003366]">
                พื้นที่ที่วิ่ง
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="flex-1 rounded-md px-3 py-2 border border-[#07204a]"
              />
            </div>
          </div>
        </div>
      </CustomizationScreen>

      <ConfirmModal
        isOpen={isExitModalOpen}
        title="ออกจากหน้าจอ"
        message="คุณแน่ใจหรือไม่ว่าต้องการออก? การเปลี่ยนแปลงของคุณจะไม่ถูก���ันทึก"
        onConfirm={() => navigate("/")}
        onCancel={() => setExitModalOpen(false)}
      />
    </>
  );
};

export default SubmitScreen;
