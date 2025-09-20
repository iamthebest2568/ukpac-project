import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";
import ShareModal from "../components/ShareModal";
import { clearDesignStorage } from "../utils/clearDesign";

const SkipEnd: React.FC = () => {
  const navigate = useNavigate();
  const [isShareOpen, setShareOpen] = React.useState(false);

  return (
    <>
      <CustomizationScreen
        title=""
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
            ขอบคุณ ที่ร่วมเป็นส่วนหนึ่งในการพัฒนาเม��อง
          </p>
          <div className="w-full flex justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F3d54db27cd9f49bf946e4a1ed5688fb3?format=webp&width=800"
              alt="เราจะประกาศรางวัล"
              className="w-full h-auto max-w-[420px] mt-2"
            />
          </div>
          <div className="flex flex-col items-stretch gap-3 pt-2 w-full max-w-sm mx-auto">
            <CtaButton
              className="w-full"
              text="จบเกม"
              onClick={() => {
                try {
                  clearDesignStorage();
                } catch (e) {}
                navigate("/ukpack2");
              }}
            />
            <SecondaryButton
              className="w-full"
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
        shareText={'ผม/ฉันได้ออกแบบรถเมล์ใน��ัน ลองดูสิ'}
      />
    </>
  );
};

export default SkipEnd;
