import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";

const ThankYouScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CustomizationScreen
      title="ขอบคุณ"
      theme="light"
      footerContent={
        <div className="flex justify-center">
          <SecondaryButton
            text="ลุ้นรับรางวัล"
            onClick={() => navigate("/ukpack2/form")}
          />
          <CtaButton
            text="ไม่ลุ้นรับรางวัล"
            onClick={() => navigate("/ukpack2/feedback-skip")}
          />
        </div>
      }
    >
      <div className="max-w-2xl mx-auto py-8 px-6 text-center">
        <div className="w-full flex justify-center mb-4">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fda6359656dee4bb3bf9d0e68709cafbf?format=webp&width=800"
            alt="ขอบคุณที่ร่วมสร้างสรรค์รถเมล์"
            className="w-full max-w-[640px] h-auto object-contain"
          />
        </div>
        <div className="inline-block bg-white border border-gray-100 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-prompt font-bold text-[#001a73]">
            ขอบคุณที่ร่วมสร้างสรรค์รถเมล์
          </h2>
          <p className="mt-3 font-sarabun text-gray-700">
            ขอบคุณสำหรับการ��อกแบบรถเมล์ของคุณ!
            คุณสามารถลงทะเบียนเพื่อเข้าร่วมลุ้นรางวัลมูลค่า 300 บาท
            หรือเลือกที่จะไม่ลุ้นรางวัลและดำเนินการต่อ
          </p>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default ThankYouScreen;
