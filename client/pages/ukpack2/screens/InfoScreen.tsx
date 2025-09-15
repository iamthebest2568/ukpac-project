import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import ConfirmModal from "../components/ConfirmModal";

const InfoScreen: React.FC = () => {
  const navigate = useNavigate();

  const [isExitModalOpen, setExitModalOpen] = React.useState(false);

  return (
    <>
      <CustomizationScreen
        title="รู้หรือไม่!"
        theme="light"
        footerContent={
          <div className="flex justify-center">
            <CtaButton
              text="ไปต่อ"
              onClick={() => navigate("/ukpack2/info-next")}
            />
          </div>
        }
      >
        <div className="space-y-6">
          <div className="w-full flex justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fad6ecaefec2f420f80fa1d09b6c8c9a0?format=webp&width=1600"
              alt="cover"
              className="w-full h-auto max-w-[900px]"
            />
          </div>

          <div className="prose text-[#001a73] font-sarabun">
            <h2 className="font-prompt font-semibold text-xl">รู้หรือไม่!</h2>
            <p>
              ในญี่ปุ่นมี Community Bus รถเมล์ขนาดเล็กที่วิ่งเข้าซอยและพื้นที่ ที่รถใหญ่เข้าไม่ถึง
              ค่าโดยสารถูกมาก บางแห่งนั่งได้ทั้งสายเพี���ง 100 เยน ทำให้ผู้สูงอายุและเด็กเข้าถึงบริการสำคัญ
              เช่น โรงพยาบาลและศูนย์ชุมชนได้สะดวกขึ้น
            </p>
          </div>
        </div>
      </CustomizationScreen>

      <ConfirmModal
        isOpen={isExitModalOpen}
        title="ออกจากหน้าจอ"
        message="คุณแน่ใจหรือไม่ว่าต้องการออก? การเปลี่ยนแปลงของคุณจะไม่ถูกบันทึก"
        onConfirm={() => navigate("/")}
        onCancel={() => setExitModalOpen(false)}
      />
    </>
  );
};

export default InfoScreen;
