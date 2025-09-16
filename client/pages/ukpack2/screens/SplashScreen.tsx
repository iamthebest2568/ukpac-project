import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CtaButton from "../components/CtaButton";
import PrivacyModal from "../components/PrivacyModal";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#e9f9ff" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 splash-top">
        <div className="max-w-3xl w-full text-center">
          <div className="w-full h-64 md:h-80 flex items-center justify-center" />
        </div>
      </div>

      <div
        className="w-full"
        style={{
          backgroundImage: "url('https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F64639762d3b74ded9017bc2cd4357d1d?format=webp&width=1600')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-3xl mx-auto py-8 px-6 text-center splash-text">
          <p className="text-[#002038] text-lg sm:text-xl md:text-2xl mb-6 font-semibold leading-snug">
            รถเมล์ในฝันที่คุณอยากขึ้นทุกวัน
            <br />
            จะมีหน้าตาอย่างไร?
          </p>
          <div className="flex justify-center">
            <CtaButton
              text="เริ่มออกแบบ"
              onClick={() => navigate("/ukpack2/chassis")}
            />
          </div>
          <div className="mt-6 text-sm text-[#07204a]">
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="underline"
            >
              นโยบายและความเป็นส่วนตัว
            </button>
          </div>
        </div>
      </div>
      <div
        data-loc="client/pages/ukpack2/screens/SplashScreen.tsx:21:7"
        style={{
          backgroundImage: "url('https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faa37e416a74147ceba751c6d9f3c7353?format=webp&width=1600')",
          backgroundPosition: '50% 50%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          fontWeight: '400',
          width: '100%',
        }}
      />
      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </div>
  );
};

export default SplashScreen;
