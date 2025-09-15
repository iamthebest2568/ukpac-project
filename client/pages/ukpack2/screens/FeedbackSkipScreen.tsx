import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import SecondaryButton from "../components/SecondaryButton";
import ShareModal from "../components/ShareModal";

const FeedbackSkipScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isShareOpen, setShareOpen] = React.useState(false);

  const handleEnd = () => {
    navigate("/ukpack2/end");
  };

  return (
    <>
      <CustomizationScreen
        title=""
        theme="light"
        footerContent={
          <div className="flex justify-center">
            <SecondaryButton text="แชร์เกมนี้ให้เพื่อน" onClick={() => setShareOpen(true)} />
            <CtaButton text="จบเกม" onClick={handleEnd} />
          </div>
        }
      >
        <div className="py-4 px-4 flex justify-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fa3d7b58f82e946aaa6790206de94e35d?format=webp&width=800"
            alt="รถเมล์ในฝัน กรุงเทพเคลื่อนที่ได้"
            className="h-16 md:h-20 w-auto"
          />
        </div>
      </CustomizationScreen>

      <ShareModal isOpen={isShareOpen} onClose={() => setShareOpen(false)} shareUrl={window.location.origin + '/ukpack2'} shareText={'ผม/ฉันได้ออกแบบรถเมล์ในฝัน ลองดูสิ'} />
    </>
  );
};

export default FeedbackSkipScreen;
