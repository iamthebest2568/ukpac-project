import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import SecondaryButton from "../components/SecondaryButton";
import ShareModal from "../components/ShareModal";
import Uk2Footer from "../components/Uk2Footer";

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
        footerBgImage={
          "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F7e994bb254cb408c86bed190e97b659e?format=webp&width=1600"
        }
        footerContent={
          <div className="flex flex-col items-stretch gap-3 w-full max-w-sm mx-auto">
            <SecondaryButton
              className="w-full"
              text="แชร์เกมนี้ให้เพื่อน"
              onClick={() => setShareOpen(true)}
            />
            <CtaButton className="w-full" text="จบเกม" onClick={handleEnd} />
          </div>
        }
      >
        <div className="max-w-4xl mx-auto pb-32 -mt-16">
          <div className="w-full flex justify-center mb-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F6b62374327d643178ab7f4a913ddc1b1?format=webp&width=800"
              alt="image"
              className="w-full max-w-[900px] h-auto object-contain mx-auto"
            />
          </div>
          <div className="flex flex-col items-center text-center text-[#001a73]">
            <h2 className="font-sarabun font-bold text-h1">ขอบคุณ</h2>
            <p className="font-sarabun text-[17.6px]">
              ที่ร่วมเป็นส่วนหนึ่งในการพัฒนาเมือง
            </p>
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9989e3bd2f31458aa7691b01a3a08b12?format=webp&width=800"
              alt="image"
              className="mt-3 w-full max-w-[640px] h-auto object-contain"
            />
          </div>
        </div>
      </CustomizationScreen>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setShareOpen(false)}
        shareUrl={window.location.origin + "/ukpack2"}
        shareText={"ผม/ฉันได้ออกแบบรถเมล์ในฝัน ลองดูสิ"}
      />
    </>
  );
};

export default FeedbackSkipScreen;
