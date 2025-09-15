import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";
import ShareModal from "../components/ShareModal";

const EndScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isShareOpen, setShareOpen] = React.useState(false);

  return (
    <>
      <CustomizationScreen
        title="ขอบคุณ"
        footerContent={
          <div className="flex justify-center">
            <CtaButton text="จบเกม" onClick={() => navigate("/ukpack2")} />
            <SecondaryButton
              text="แชร์เกมนี้กับเพื่อน"
              onClick={() => setShareOpen(true)}
            />
          </div>
        }
      >
        <div className="space-y-6">
          <div className="w-full h-64 bg-white rounded-md flex items-center justify-center text-[#000d59]">
            Main illustration placeholder
          </div>
          <p className="text-white font-sarabun">
            ขอบคุณที่เข้าร่วม ถึงแม้คุณจะไม่ได้ร่วมลุ้นรางวัล
            คุณก็ช่วยออกแบบรถเมล์ให้ชุมชนได้ดีขึ้น
          </p>
        </div>
      </CustomizationScreen>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setShareOpen(false)}
        shareUrl={window.location.origin + '/ukpack2'}
        shareText={'ผม/ฉันได้ออกแบบรถเมล์ในฝัน ลองดูสิ'}
      />
    </>
  );
};

export default EndScreen;
