import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";
import ShareModal from "../components/ShareModal";
import { clearDesignStorage } from "../utils/clearDesign";

const EndScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isShareOpen, setShareOpen] = React.useState(false);

  return (
    <>
      <CustomizationScreen
        title="ขอบคุณ"
        theme="light"
      >
        <div className="space-y-6">
          <div className="w-full flex justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc36f7d2aca87432f90a5a36fb28b97ed?format=webp&width=1600"
              alt="ภาพขอบคุณ"
              className="w-full h-auto max-w-[720px]"
            />
          </div>
          <p className="text-[#001a73] font-prompt font-semibold text-center">
            ขอบคุณ ที่ร่วมเป็นส่วนหนึ่งในการพัฒนาเมือง
          </p>
          <div className="w-full flex justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F82c90d874bf3491baf4f370102aa49f7?format=webp&width=800"
              alt="ประกาศรางวัล"
              className="w-full h-auto max-w-[420px] mt-2"
            />
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <CtaButton
              text="จบเกม"
              onClick={() => {
                try {
                  clearDesignStorage();
                } catch (e) {}
                navigate("/ukpack2");
              }}
            />
            <SecondaryButton
              text="แชร์เกมนี้กับเพื่อน"
              onClick={() => setShareOpen(true)}
            />
          </div>
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
