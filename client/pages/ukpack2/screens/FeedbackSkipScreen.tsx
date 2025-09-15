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
        title="ขอบคุณ"
        theme="light"
        footerContent={
          <div className="flex justify-center">
            <SecondaryButton text="แชร์เกมนี้ให้เพื่อน" onClick={() => setShareOpen(true)} />
            <CtaButton text="จบเกม" onClick={handleEnd} />
          </div>
        }
      >
        <div className="py-6 px-4">
          <h2 className="text-xl font-prompt font-semibold text-[#001a73]">ขอบคุณสำหรับความคิดเห็นของคุณ</h2>
          <p className="mt-3 text-sm text-gray-700">คุณสามารถแชร์เกมนี้กับเพื่อนหรือจบเกมได้ตามต้องการ</p>
        </div>
      </CustomizationScreen>

      <ShareModal isOpen={isShareOpen} onClose={() => setShareOpen(false)} shareUrl={window.location.origin + '/ukpack2'} shareText={'ผม/ฉันได้ออกแบบรถเมล์ในฝัน ลองดูสิ'} />
    </>
  );
};

export default FeedbackSkipScreen;
