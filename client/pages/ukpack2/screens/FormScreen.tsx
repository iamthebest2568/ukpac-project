import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import SecondaryButton from "../components/SecondaryButton";

const IconPerson = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 60 63"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="30" cy="20" r="12" stroke="#000D59" strokeWidth="3" fill="none" />
    <path
      d="M8 55c3-12 15-18 22-18s19 6 22 18"
      stroke="#000D59"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const IconPhone = () => (
  <svg
    width="28"
    height="48"
    viewBox="0 0 39 69"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="33" height="63" rx="8" stroke="#000D59" strokeWidth="3" fill="none" />
    <circle cx="19.5" cy="58" r="3" fill="#000D59" />
    <rect x="14" y="8" width="11" height="2" rx="1" fill="#000D59" />
  </svg>
);

const FormScreen: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const submit = () => {
    try {
      sessionStorage.setItem("design.entry", JSON.stringify({ name, phone }));
    } catch (e) {}
    navigate("/ukpack2/confirmation");
  };

  const skip = () => {
    navigate("/ukpack2/end");
  };

  return (
    <CustomizationScreen
      title=""
      theme="light"
      footerContent={
        <div className="flex flex-col items-stretch gap-3 w-full max-w-sm mx-auto">
          <CtaButton className="w-full" text="ลุ้นรับรางวัล" onClick={submit} />
          <SecondaryButton className="w-full" text="ไม่" onClick={skip} />
        </div>
      }
    >
      <div className="max-w-xl mx-auto pt-4 space-y-5">
        <div className="w-full flex justify-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F33272924342744429f8155587f834f20?format=webp&width=800"
            alt="รถเมล์ในฝัน"
            className="block max-w-[520px] w-4/5 md:w-2/3 h-auto object-contain"
          />
        </div>

        {/* Name Field (no inner divider line) */}
        <div className="relative">
          <div className="flex items-center w-full h-16 md:h-20 border-[5px] border-[#000D59] rounded-[20px] bg-white">
            <div className="flex items-center justify-center w-14 md:w-16 h-full">
              <IconPerson />
            </div>
            <input
              className="flex-1 h-full bg-transparent border-none outline-none text-black placeholder-gray-500 font-prompt text-lg md:text-xl font-light px-4"
              placeholder="ชื่อ-นามสกุล"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Phone Field (no inner divider line) */}
        <div className="relative">
          <div className="flex items-center w-full h-16 md:h-20 border-[5px] border-[#000D59] rounded-[20px] bg-white">
            <div className="flex items-center justify-center w-14 md:w-16 h-full">
              <IconPhone />
            </div>
            <input
              className="flex-1 h-full bg-transparent border-none outline-none text-black placeholder-gray-500 font-prompt text-lg md:text-xl font-light px-4"
              placeholder="เบอร์โทรศัพท์"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
            />
          </div>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default FormScreen;
