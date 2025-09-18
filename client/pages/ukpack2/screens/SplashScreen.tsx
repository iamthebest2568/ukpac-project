import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivacyModal from "../components/PrivacyModal";
import CtaButton from "../components/CtaButton";

const HERO_SRC = "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F56cd643a31b04240bbdbdec0b25906a2?format=webp&width=800";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 0,
      }}
    >
      {/* Top: image */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: 12 }}>
        <img
          src={HERO_SRC}
          alt="bus"
          style={{
            display: "block",
            margin: "0 auto",
            width: "100%",
            maxWidth: "min(80vw, 420px)",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>


      {/* Bottom: text + buttons (with decorative background) */}
      <div style={{
        width: "100%",
        paddingBottom: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        boxSizing: "border-box",
        backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1ae91a1faaef4abeb8eb1b6603bd90f5?format=webp&width=800')`,
        backgroundPosition: "bottom center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}>
        <div style={{ textAlign: "center", padding: "12px 20px" }}>
          <div>รถเมล์ในฝันที่คุณอยากขึ้นทุกวัน</div>
          <div>จะมีหน้าตาอย่างไร?</div>
        </div>
        <div>
          <CtaButton text="เริ่มออกแบบ" onClick={() => navigate("/ukpack2/chassis")} />
        </div>

        <div>
          <button type="button" onClick={() => setShowPrivacy(true)}>นโยบายและความเป็นส่วนตัว</button>
        </div>
      </div>

      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};

export default SplashScreen;
