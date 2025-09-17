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
      style={{ position: 'relative', backgroundColor: '#ffffff', overflow: 'hidden' }}
    >
      {/* Turquoise footer background (under image) */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '42vh', backgroundColor: '#04d9f9', zIndex: 0 }} aria-hidden />

      {/* Full-bleed hero image (above turquoise) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, backgroundColor: '#ffffff', minHeight: '100svh', pointerEvents: 'none' }} aria-hidden>
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcb178a40e22648eca72705d402137a33?format=webp&width=1080"
          srcSet={
            `https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcb178a40e22648eca72705d402137a33?format=webp&width=480 480w, ` +
            `https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcb178a40e22648eca72705d402137a33?format=webp&width=720 720w, ` +
            `https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcb178a40e22648eca72705d402137a33?format=webp&width=1080 1080w, ` +
            `https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcb178a40e22648eca72705d402137a33?format=webp&width=1600 1600w`
          }
          sizes="100vw"
          alt="รถเมล์ในฝัน"
          className="w-full"
          style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '140vh', objectFit: 'contain', objectPosition: 'center bottom' }}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* White curved overlay to mask top portion of image and produce curve edge */}
      <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '62vh', zIndex: 2, pointerEvents: 'none' }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
          <path d="M0,70 C20,85 40,85 50,82 C60,79 80,75 100,88 L100,100 L0,100 Z" fill="#ffffff" />
        </svg>
      </div>

      <div className="footer-container mt-auto">
        <div className="footer-content" style={{ position: 'relative', textAlign: 'center', zIndex: 2, padding: '64px 20px 20px', fontWeight: 400 }}>
          <h2 style={{ color: 'rgb(0, 13, 89)', fontSize: '18px', fontWeight: 700, lineHeight: '21.6px', marginBottom: '8px', textDecorationColor: 'rgb(0, 13, 89)' }} className="text-2xl md:text-3xl mb-2">รถเมล์ในฝันที่คุณอยากขึ้นทุกวัน<br />จะมีหน้าตาอย่าง��ร?<br /></h2>
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
