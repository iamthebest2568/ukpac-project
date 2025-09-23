import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import SecondaryButton from "../components/SecondaryButton";
import { logEvent } from "../../../services/dataLogger.js";

const IconPerson = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 60 63"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="30"
      cy="20"
      r="12"
      stroke="#000D59"
      strokeWidth="3"
      fill="none"
    />
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
    <rect
      x="3"
      y="3"
      width="33"
      height="63"
      rx="8"
      stroke="#000D59"
      strokeWidth="3"
      fill="none"
    />
    <circle cx="19.5" cy="58" r="3" fill="#000D59" />
    <rect x="14" y="8" width="11" height="2" rx="1" fill="#000D59" />
  </svg>
);

const FormScreen: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const submit = () => {
    logEvent({
      event: "FORM_SUBMIT",
      payload: { name, phone, page: "/ukpack2/form" },
    });
    try {
      sessionStorage.setItem("design.entry", JSON.stringify({ name, phone }));
    } catch (e) {}
    navigate("/ukpack2/confirmation");
  };

  const skip = () => {
    logEvent({ event: "FORM_SKIP", payload: { page: "/ukpack2/form" } });
    navigate("/ukpack2/end");
  };

  return (
    <CustomizationScreen title="" theme="light">
      <div className="max-w-xl mx-auto pt-4 space-y-5 font-sarabun text-[17.6px] form-no-focus">
        <style>{`.form-no-focus *:focus{outline:none !important;box-shadow:none !important;}`}</style>
        <div
          className="w-full flex justify-center -mt-40 md:-mt-48"
          style={{ marginTop: "-15px" }}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F33272924342744429f8155587f834f20?format=webp&width=800"
            alt="image"
            className="block max-w-[520px] w-[75%] md:w-[60%] h-auto object-contain"
          />
        </div>
        <div
          className="w-full flex justify-center -mt-36 md:-mt-40"
          style={{ marginTop: "-15px" }}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe788f24196524b1daad2340de622d2d6?format=webp&width=800"
            alt="image"
            className="block max-w-[520px] w-[75%] md:w-[60%] h-auto object-contain"
          />
        </div>

        {/* Name Field (no inner divider line) */}
        <div className="relative">
          <div className="flex items-center w-full h-16 md:h-20 border-[5px] border-[#000D59] rounded-[20px] bg-white">
            <div className="flex items-center justify-center w-14 md:w-16 h-full">
              <IconPerson />
            </div>
            <div className="w-px h-10 md:h-12 bg-[#000D59] mx-2" />
            <input
              className="flex-1 h-full bg-transparent border-none outline-none text-black placeholder-gray-500 font-sarabun text-[17.6px] font-normal px-4"
              placeholder="ชื่อ-นามสกุล"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() =>
                logEvent({
                  event: "FORM_NAME_BLUR",
                  payload: { nameLen: name.length },
                })
              }
            />
          </div>
        </div>

        {/* Phone Field (no inner divider line) */}
        <div className="relative">
          <div className="flex items-center w-full h-16 md:h-20 border-[5px] border-[#000D59] rounded-[20px] bg-white">
            <div className="flex items-center justify-center w-14 md:w-16 h-full">
              <IconPhone />
            </div>
            <div className="w-px h-10 md:h-12 bg-[#000D59] mx-2" />
            <input
              className="flex-1 h-full bg-transparent border-none outline-none text-black placeholder-gray-500 font-sarabun text-[17.6px] font-normal px-4"
              placeholder="เบอร์โทรศัพท์"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() =>
                logEvent({
                  event: "FORM_PHONE_BLUR",
                  payload: { phoneLen: phone.length },
                })
              }
              type="tel"
            />
          </div>
        </div>
      </div>

      <footer
        className="rounded-t-3xl py-12 px-6 bg-no-repeat bg-top bg-cover"
        style={{
          backgroundImage:
            "url('https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc3874bf37db54abeb4a13c308b0df9a4?format=webp&width=1600')",
          minHeight: "380px",
          /* Use normal width (inside container) instead of full-bleed to avoid layout issues on this page */
          width: "100%",
          marginLeft: 0,
          backgroundPosition: 'top center',
          backgroundSize: 'cover',
        }}
      >
        <div className="max-w-4xl mx-auto flex items-end justify-center h-full">
          <div className="flex flex-col items-center gap-3 pb-12">
            <div style={{ width: "220px", marginTop: "32px" }}>
              <CtaButton
                className="w-full"
                text="ลุ้นรับรางวัล"
                onClick={submit}
                style={{ width: "220px", height: "48px" }}
              />
            </div>
            <div style={{ width: "220px" }}>
              <SecondaryButton
                className="w-full h-12"
                text="ไม่รับรางวัล"
                onClick={skip}
              />
            </div>
          </div>
        </div>
      </footer>
    </CustomizationScreen>
  );
};

export default FormScreen;
