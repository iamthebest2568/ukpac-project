import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import SecondaryButton from "../components/SecondaryButton";
import ShareModal from "../components/ShareModal";
import MyFooter from "../../mydreambus/components/MyFooter";

const FeedbackSkipScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isShareOpen, setShareOpen] = React.useState(false);

  const handleEnd = () => {
    navigate("/mydreambus/end");
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
          <MyFooter className="force-vertical">
            <SecondaryButton
              className="w-full"
              text="แชร์เกมนี้ให้เพื่อน"
              onClick={() => setShareOpen(true)}
            />
            <CtaButton className="w-full" text="จบเกม" onClick={handleEnd} />
          </MyFooter>
        }
      >
        <div className="w-full flex justify-center mb-4" style={{ overflow: "visible" }}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F08abc8bef92e40b7bab98188c805f46b?format=webp&width=800"
            alt="เสร็จแล้ว"
            className="w-full max-w-[360px] h-auto object-contain mx-auto"
            style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.12))", marginTop: 0 }}
          />
        </div>
        <div className="max-w-4xl mx-auto pt-6 pb-24">
          <div
            className="w-full flex justify-center mb-4"
            style={{ overflow: "visible" }}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F6b62374327d643178ab7f4a913ddc1b1?format=webp&width=800"
              alt="image"
              className="w-full max-w-[520px] h-auto object-contain mx-auto"
              style={{ marginTop: 0, maxHeight: "52vh" }}
            />
          </div>
          <div className="flex flex-col items-center text-center text-[#001a73]">
            <h2 className="font-sarabun font-bold text-h1">ขอบคุณ</h2>
            <p className="font-sarabun text-[17.6px]">
              ที่ร่วมเป็นส่วนหนึ่งในการพัฒนาเมือง
            </p>
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff510b5b92f6a498f8cd020d9816d4d5a?format=webp&width=800"
              alt="ประกาศรางวัล"
              className="mt-3 w-full max-w-[480px] h-auto object-contain"
              style={{
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                borderRadius: 12,
              }}
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

export default FeedbackSkipScreen;
