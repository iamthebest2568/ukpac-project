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

      <div className="footer-container mt-auto">
        <div className="footer-content" style={{ position: 'relative', textAlign: 'center', zIndex: 2, padding: '114px 20px 20px', fontWeight: 400 }}>
          <h2 style={{ color: 'rgb(0, 13, 89)', fontSize: '18px', fontWeight: 700, lineHeight: '21.6px', marginBottom: '8px', textDecorationColor: 'rgb(0, 13, 89)' }} className="text-2xl md:text-3xl mb-2">รถเมล์ในฝันที่คุณอยากขึ้นทุกวัน<br />จะมีหน้าตาอย่างไร?<br /></h2>
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
              style={{ display: 'inline-block', borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: '0.8px', fontWeight: 600, position: 'relative', textDecorationColor: 'currentColor', textDecorationLine: 'underline', zIndex: 20, backgroundColor: 'transparent' }}
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
