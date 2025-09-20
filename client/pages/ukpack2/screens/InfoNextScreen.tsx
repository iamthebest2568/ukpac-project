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
        <div className="w-full flex justify-center mb-6 -mt-8 md:-mt-12">
          <div className="w-[75%] mx-auto px-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8252bd27b98340349ac37000716c83db?format=webp&width=800"
              alt="header image"
              className="w-full h-auto object-contain rounded-b-xl max-h-[220px] md:max-h-[360px] mx-auto"
              style={{ objectPosition: 'center' }}
            />
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
