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
              className="w-full h-auto max-w-[720px] mb-6"
            />
          </div>
        </div>

        <footer
          className="rounded-t-3xl py-12 px-6 bg-no-repeat bg-top bg-cover"
          style={{
            backgroundImage:
              "url('https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc3874bf37db54abeb4a13c308b0df9a4?format=webp&width=1600')",
            minHeight: '360px',
            width: '100vw',
            marginLeft: 'calc(50% - 50vw)'
          }}
        >
          <div className="max-w-4xl mx-auto flex items-end justify-center h-full">
            <div className="flex flex-col items-center gap-3 pt-6 pb-10">
              <div style={{ width: '220px' }}>
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
              </div>
              <div style={{ width: '220px' }}>
                <SecondaryButton
                  className="w-full"
                  text="แชร์เกมนี้กับเพื่อน"
                  onClick={() => setShareOpen(true)}
                />
              </div>
            </div>
          </div>
        </footer>
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
