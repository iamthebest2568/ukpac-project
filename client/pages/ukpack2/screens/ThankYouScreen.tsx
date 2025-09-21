import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";

const ThankYouScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CustomizationScreen title="" theme="light" fullWidth>
      <div className="max-w-2xl mx-auto pt-4 pb-8 text-center" style={{paddingLeft: 20, paddingRight: 20}}>
        <div className="w-full flex justify-center mb-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fda6359656dee4bb3bf9d0e68709cafbf?format=webp&width=800"
            alt="image"
            className="w-full max-w-[640px] h-auto object-contain"
          />
        </div>
        <div className="inline-block bg-white rounded-xl p-6 text-[#001a73]">
          <p className="mt-3 font-prompt font-semibold text-[18px]">
            เราจะนำข้อมูลเหล่านี้รวบรวม เป็นข้อเสนอส่งต่อเพื่อการพัฒนา
            รถประจำทางให้ดียิ่งขึ้น
          </p>
          <hr className="my-6 border-t-4 border-[#000D59] w-full" />
          <div className="font-prompt font-semibold text-[18px] leading-relaxed">
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

      <footer
        className="rounded-t-3xl py-12 px-6 bg-no-repeat bg-top bg-cover"
        style={{
          backgroundImage:
            "url('https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc3874bf37db54abeb4a13c308b0df9a4?format=webp&width=1600')",
          minHeight: '375px',
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)'
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-center h-full" style={{paddingLeft: 20, paddingRight: 20}}>
          <div className="flex flex-col items-center gap-3 py-6">
            <div style={{ width: '220px' }}>
              <SecondaryButton
                className="w-full"
                text="ลุ้นรับรางวัล"
                onClick={() => navigate("/ukpack2/form")}
              />
            </div>
            <div style={{ width: '220px' }}>
              <CtaButton
                className="w-full"
                text="ไม่ลุ้นรับรางวัล"
                onClick={() => navigate("/ukpack2/feedback-skip")}
              />
            </div>
          </div>
        </div>
      </footer>
    </CustomizationScreen>
  );
};

export default ThankYouScreen;
