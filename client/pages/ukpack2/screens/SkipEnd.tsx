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

  const footer = (
    <div className="max-w-4xl mx-auto flex items-end justify-center h-full">
      <div className="flex flex-col items-center gap-3 pt-6 pb-10">
        <div style={{ width: "220px" }}>
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
        </div>
        <div style={{ width: "220px" }}>
          <SecondaryButton
            className="w-full"
            text="แชร์เกมนี้กับเพื่อน"
            onClick={() => setShareOpen(true)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <CustomizationScreen
        title=""
        theme="light"
        footerBgImage={
          "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdbf2af3b7e1d4d449406bb4a5323834b?format=webp&width=1600"
        }
        footerContent={footer}
      >
        <div className="space-y-6">
          <div className="w-full flex justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdbf2af3b7e1d4d449406bb4a5323834b?format=webp&width=800"
              alt="image"
              className="w-full h-auto max-w-[360px] mb-6"
            />
          </div>
        </div>
      </CustomizationScreen>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setShareOpen(false)}
        shareUrl={window.location.origin + "/ukpack2"}
        shareText={"ผม/ฉันได้ออกแบบรถเมล์ในนี้ ลองดูสิ"}
      />
    </>
  );
};

export default SkipEnd;
