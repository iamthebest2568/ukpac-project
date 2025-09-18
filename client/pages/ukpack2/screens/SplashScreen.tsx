import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivacyModal from "../components/PrivacyModal";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div>
      <h2>
        รถเมล์ในฝันที่คุณอยากขึ้นทุกวัน
        <br />
        จะมีหน้าตาอย่างไร?
      </h2>

      <div>
        <button type="button" onClick={() => navigate("/ukpack2/chassis")}>เริ่มออกแบบ</button>
      </div>

      <div>
        <button type="button" onClick={() => setShowPrivacy(true)}>นโยบายและความเป็นส่วนตัว</button>
      </div>

      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};

export default SplashScreen;
