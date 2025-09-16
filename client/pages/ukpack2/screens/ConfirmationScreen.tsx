import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";
import ShareModal from "../components/ShareModal";

const ConfirmationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isShareOpen, setShareOpen] = React.useState(false);

  return (
    <>
      <CustomizationScreen
        title=""
        theme="light"
        headerContent={
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F6b62374327d643178ab7f4a913ddc1b1?format=webp&width=800"
            alt="ยืนยันข้อมูลสำเร็จ"
            className="h-16 md:h-20 w-auto object-contain"
          />
        }
        footerContent={
          <div className="flex justify-center gap-3">
            <CtaButton text="จบเกม" onClick={() => navigate("/ukpack2")} />
            <SecondaryButton
              text="แชร์เกมนี้กับเพื่อน"
              onClick={() => setShareOpen(true)}
            />
          </div>
        }
      >
        {/* Body intentionally left empty as requested */}
      </CustomizationScreen>

      <ShareModal isOpen={isShareOpen} onClose={() => setShareOpen(false)} shareUrl={window.location.origin + '/ukpack2'} shareText={'ผม/ฉันได้ออกแบบรถเมล์ในฝัน ลองดูสิ'} />
    </>
  );
};

export default ConfirmationScreen;
