import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";

const EndScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CustomizationScreen
      title="ขอบคุณ"
      footerContent={
        <div className="flex justify-center">
          <CtaButton text="จบเกม" onClick={() => navigate("/ukpack2")} />
          <SecondaryButton
            text="แชร์เกมน���้กับเพื่อน"
            onClick={() => console.log("share")}
          />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="w-full h-64 bg-white rounded-md flex items-center justify-center text-[#000d59]">
          Main illustration placeholder
        </div>
        <p className="text-white font-sarabun">
          ขอบคุณที่เข้าร่วม ถึงแม้คุณจะไม่ได้ร่วมลุ้นรางวัล
          คุณก็ช่วยออกแบบรถเมล์ให้ชุมชนได้ดีขึ้น
        </p>
      </div>
    </CustomizationScreen>
  );
};

export default EndScreen;
