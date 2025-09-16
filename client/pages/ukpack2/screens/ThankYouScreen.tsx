import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";

const ThankYouScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CustomizationScreen
      title=""
      theme="light"
      footerContent={
        <div className="flex flex-col items-center gap-3">
          <SecondaryButton
            text="ลุ้นรับรางวัล"
            onClick={() => navigate("/ukpack2/form")}
            className="w-full max-w-xs"
          />
          <CtaButton
            text="ไม่ลุ้นรับรางวัล"
            onClick={() => navigate("/ukpack2/feedback-skip")}
            className="w-full max-w-xs"
          />
        </div>
      }
    >
      <div className="max-w-2xl mx-auto pt-4 pb-8 px-6 text-center">
        <div className="w-full flex justify-center mb-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fda6359656dee4bb3bf9d0e68709cafbf?format=webp&width=800"
            alt="ขอบคุณที่ร่วมสร้างสรรค์รถเมล์"
            className="w-full max-w-[640px] h-auto object-contain"
          />
        </div>
        <div className="inline-block bg-white border border-gray-100 rounded-xl p-6 shadow-md text-[#001a73]">
          <h2 className="text-2xl font-prompt font-bold">
            ขอบคุณที่ร่วมสร้างสรรค์รถเมล์
          </h2>
          <p className="mt-3 font-sarabun text-gray-700">
            เราจะนำข้อมูลเหล่านี้รวบรวม เป็นขอเสนอส่งต่อเพื่อการพัฒนา
            รถประจำทางให้ดียิ่งขึ้น
          </p>
          <hr className="my-6 border-[#e5e7eb]" />
          <div className="font-sarabun leading-relaxed">
            <p>คุณอยากกรอกข้อมูลเพิ่ม</p>
            <p>เพื่อลุ้นรับรางวัล</p>
            <p>ลุ้นรางวัลบัตรขนส่งสาธารณะ</p>
            <p>
              <span className="text-3xl md:text-4xl font-extrabold text-[#001a73]">
                300
              </span>{" "}
              บาท หรือไม่
            </p>
          </div>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default ThankYouScreen;
