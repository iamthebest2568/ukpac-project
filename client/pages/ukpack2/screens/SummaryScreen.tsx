import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SummaryDetails from "../components/SummaryDetails";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";
import MyFooter from "../mydreambus/components/MyFooter";
import { HERO_IMAGE, CHASSIS_LABELS } from "../utils/heroImages";
import styles from "./chassis.module.css";

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
    <CustomizationScreen
      title="รถเมล์คันนี้ที่คุณออกแบบใกล้เคียงกับรถเมล์ในฝันของคุณแล้วหรือไม่"
      theme="light"
      fullWidth
      containerPaddingClass="px-4 py-2"
      footerContent={
        <Uk2Footer>
          <div className="w-full max-w-sm p-4 md:p-6 flex flex-col items-stretch gap-3">
            <div className="w-full">
              <SecondaryButton
                text="ใช่, ไปต่อ"
                onClick={() => navigate("/mydreambus/info")}
                className="w-full"
              />
            </div>
            <div className="w-full">
              <CtaButton
                text="ไม่ใช่, ลองอีกครั้ง"
                onClick={() => navigate("/mydreambus/chassis")}
                className="w-full"
              />
            </div>
          </div>
        </Uk2Footer>
      }
    >
      <div className={`${styles.previewInner} mx-auto px-4 py-2`}>
        <SummaryDetails />
      </div>
    </CustomizationScreen>
  );
};

export default SummaryScreen;
