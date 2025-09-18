import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivacyModal from "../components/PrivacyModal";

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
