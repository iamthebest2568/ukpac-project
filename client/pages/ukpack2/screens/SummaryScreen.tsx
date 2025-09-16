import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    medium: "รถเมล์ขนาดกลาง 31–40 ที่นั่ง",
    large: "รถเมล์ขนาดใหญ่ 41-50 ที่นั่ง",
    extra: "รถกระบะดัดแปลง 8-12 ที่นั่ง",
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
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <header className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-prompt font-semibold">
              ปรับแต่งรถเมล์ของคุณ
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              นี่คือรถเมล์ในฝันของคุณ
            </p>
          </header>

          <SummaryDetails />
        </div>
      </div>

      {/* Fixed footer */}
      <footer className="w-full bg-[#00d5f9] drop-shadow-lg rounded-t-3xl sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="p-4 md:p-6 flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
            <div className="w-full">
              <SecondaryButton
                text="กลับไปแก้ไข"
                onClick={() => navigate("/ukpack2/design")}
                className="w-full text-sm md:text-base"
              />
            </div>

            <div className="w-full">
              <CtaButton
                text="ออกแบบเสร็จแล้ว"
                onClick={() => navigate("/ukpack2/info")}
                className="w-full text-sm md:text-base"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SummaryScreen;
