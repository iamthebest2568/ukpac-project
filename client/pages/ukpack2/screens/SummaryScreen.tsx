import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SummaryDetails from "../components/SummaryDetails";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";

const SummaryScreen: React.FC = () => {
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
      if (seating) data.seating = JSON.parse(seating);
      if (amenities) data.amenities = JSON.parse(amenities);
      if (payment) data.payment = JSON.parse(payment);
      if (doors) data.doors = JSON.parse(doors);
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

  function displayDoor(raw: any) {
    if (!raw) return "-";
    if (typeof raw === "string") {
      if (raw === "1") return "1 ประตู";
      if (raw === "2") return "2 ประตู";
      if (raw === "ramp") return "ทางลาดสำหรับรถเข็น/ผู้พิการ";
      if (raw === "emergency") return "ประตูฉุกเฉิน";
      return raw;
    }
    if (typeof raw === "object") {
      if (raw.doorChoice)
        return raw.doorChoice === "1"
          ? "1 ประตู"
          : raw.doorChoice === "2"
            ? "2 ประตู"
            : String(raw.doorChoice);
      if (raw.hasRamp) return "ทางลาดสำหรับรถเข็น/ผู้พิการ";
      if (raw.highLow) return "ประตูฉุกเฉิน";
    }
    return String(raw);
  }

  return (
    <CustomizationScreen title="ปรับแต่งรถเมล์ของคุณ" theme="light" fullWidth containerPaddingClass="px-4 py-2" footerContent={
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-center">
          <div className="w-full max-w-sm p-4 md:p-6 flex flex-col items-stretch gap-3">
            <div className="w-full">
              <SecondaryButton
                text="กลับไปแก้ไข"
                onClick={() => navigate("/ukpack2/design")}
                className="w-full"
              />
            </div>
            <div className="w-full">
              <CtaButton
                text="ออกแบบเสร็จแล้ว"
                onClick={() => navigate("/ukpack2/info")}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    }>
      <div className="max-w-5xl mx-auto px-4 py-4">
        <SummaryDetails />
      </div>
    </CustomizationScreen>
  );
};

export default SummaryScreen;
