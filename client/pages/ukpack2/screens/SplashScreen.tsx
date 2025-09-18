import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivacyModal from "../components/PrivacyModal";

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
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center", paddingBottom: 80 }}>
        <img src={HERO_SRC} alt="bus" style={{ display: "block", margin: "0 auto 20px", maxWidth: 360, width: "100%", height: "auto" }} />

        <h2 style={{ margin: 0 }}>
          รถเมล์ในฝันที่คุณอยากขึ้นทุกวัน
          <br />
          จะมีหน้าตาอย่างไร?
        </h2>

        <div style={{ marginTop: 24 }}>
          <button type="button" onClick={() => navigate("/ukpack2/chassis")}>เริ่มออกแบบ</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="button" onClick={() => setShowPrivacy(true)}>นโยบายและความเป็นส่วนตัว</button>
        </div>
      </div>

      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};

export default SplashScreen;
