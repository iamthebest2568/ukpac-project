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
      <CustomizationScreen title="" theme="light">
        <div
          className="space-y-6 px-4 pb-12 md:pb-20"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 64px)",
          }}
        >
          <div className="w-full flex justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F02ba14ac31e7499d8feb398adebc6580?format=webp&width=1600"
              alt="image"
              className="w-full h-auto max-w-[720px]"
              style={{ marginBottom: 4 }}
            />
          </div>
          <p className="text-[#001a73] font-prompt font-semibold text-center">
            ขอบคุณ ที่ร่วมเป็นส่วนหนึ่งในการพั��นาเมือง
          </p>
          <div className="w-full flex justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F02ba14ac31e7499d8feb398adebc6580?format=webp&width=800"
              alt="image"
              className="w-full h-auto max-w-[420px] mt-2"
              style={{ marginBottom: 8 }}
            />
          </div>
          <div className="flex flex-col items-center gap-3 pt-2 w-full max-w-sm mx-auto">
            <CtaButton
              className="w-full"
              text="จบเกม"
              onClick={() => {
                try {
                  clearDesignStorage();
                } catch (e) {}
                navigate("/mydreambus");
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
        shareUrl={window.location.origin + "/mydreambus"}
        shareText={"ผม/ฉันได้ออกแบบรถเมล์ในฝัน ลองดูสิ"}
      />
    </>
  );
};

export default EndScreen;
