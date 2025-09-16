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
          <div className="w-full h-64 md:h-80 flex items-center justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbfa15cb7d28d4bff8817c7e0ca03bf58?format=webp&width=1600"
              alt="cover"
              className="h-auto object-contain mx-auto"
              style={{ width: "80%" }}
              decoding="async"
              loading="eager"
            />
          </div>
        </div>
      </div>

      <div
        className="w-full splash-bg"
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
              className="cta-button"
            />
          </div>
        </div>
      </div>
      <div className="footer-container">
        <div className="footer-content">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">รถเมล์ในฝันที่คุณอยากขึ้นทุกกวัน<br />จะมีหน้าตาอย่างไร?<br /></h2>
          <div className="flex items-center justify-center gap-4">
            <CtaButton
              text="เริ่มออกแบบ"
              onClick={() => navigate("/ukpack2/chassis")}
              className="cta-button"
            />
          </div>
          <div className="mt-4 text-sm">
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="underline privacy-button"
            >
              นโยบายและความเป็นส่วนตัว
            </button>
          </div>
        </div>
      </div>
      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </div>
  );
};

export default SplashScreen;
