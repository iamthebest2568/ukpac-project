import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";
import ShareModal from "../components/ShareModal";
import MyFooter from "../../mydreambus/components/MyFooter";

const ConfirmationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isShareOpen, setShareOpen] = React.useState(false);

  return (
    <>
      <CustomizationScreen
        title=""
        theme="light"
        footerBgClass="bg-white"
        footerContent={
          <MyFooter className="bg-white">
            <div style={{ width: "220px" }}>
              <CtaButton
                className="w-full"
                text="จบเกม"
                onClick={() => navigate("/mydreambus")}
              />
            </div>
            <div style={{ width: "220px" }}>
              <SecondaryButton
                className="w-full"
                text="แชร์เกมนี้กับเพื่อน"
                onClick={() => setShareOpen(true)}
              />
            </div>
          </MyFooter>
        }
      >
        <div className="max-w-4xl mx-auto pb-8 -mt-8">
          <div className="w-full flex justify-center mt-6 mb-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F6b62374327d643178ab7f4a913ddc1b1?format=webp&width=800"
              alt="image"
              className="h-auto object-contain mx-auto"
              style={{ width: "500px", maxWidth: "100%" }}
            />
          </div>
          <div className="flex flex-col items-center text-center text-[#001a73]">
            <h2 className="font-prompt font-semibold text-[22px]">ขอบคุณ</h2>
            <p className="mt-2 font-prompt font-semibold text-[18px]">
              ที่ร่วมเป็นส่วนหนึ่งในการพัฒนาเมือง
            </p>
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9989e3bd2f31458aa7691b01a3a08b12?format=webp&width=800"
              alt="image"
              className="h-auto object-contain"
              style={{
                marginTop: "calc(2rem - 5px)",
                width: "400px",
                maxWidth: "100%",
              }}
            />

            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F762b2f7f19ec4d069acbd2c8a5deace4?format=webp&width=800"
              alt="additional image"
              className="w-full h-auto object-contain"
              style={{ marginTop: "12px", maxWidth: "462px" }}
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

export default ConfirmationScreen;
