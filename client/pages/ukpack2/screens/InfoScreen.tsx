import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import ConfirmModal from "../components/ConfirmModal";

const CHASSIS_LABELS: Record<string, string> = {
  small: "รถเมล์ขนาดเล็ก 16–30 ที่นั่ง",
  medium: "รถเมล์ขนาดกลาง 31–40 ที่นั่ง",
  large: "รถเมล์ขนาดใหญ่ 41–50 ที่นั่ง",
  extra: "รถกระบะดัดแปลง 8–12 ที่นั่ง",
};
const HERO_IMAGE: Record<string, string> = {
  small:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5ea1b3d990e44d49aa5441bc3a4b3bcc?format=webp&width=800",
  medium:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fab8ddd78f9a0478bb27f5818928665f3?format=webp&width=800",
  large:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fefc1e1ed3bcb4769b51d1544d43b3b5f?format=webp&width=800",
  extra:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9a8a7536ced24db19a65409fbba1c6b6?format=webp&width=800",
};
const HERO_SHADOW =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb1e30b1544304677996b179fc27ae5c7?format=webp&width=800";

const InfoScreen: React.FC = () => {
  const navigate = useNavigate();

  const [isExitModalOpen, setExitModalOpen] = React.useState(false);

  const selected = React.useMemo(() => {
    try {
      return sessionStorage.getItem("design.chassis") || "medium";
    } catch (e) {
      return "medium";
    }
  }, []);
  const selectedLabel = CHASSIS_LABELS[selected] || "";

  return (
    <>
      <CustomizationScreen
        title=""
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

          <div className="flex flex-col items-center mt-2">
            <div className="relative w-full flex items-center justify-center" style={{ minHeight: "160px" }}>
              <img
                src={HERO_SHADOW}
                alt="เงารถ"
                className="absolute bottom-0 w-[72%] max-w-[420px] pointer-events-none select-none"
                decoding="async"
                loading="eager"
                aria-hidden="true"
              />
              <div className="relative w-[72%] max-w-[420px]">
                <img
                  src={HERO_IMAGE[selected]}
                  alt={selectedLabel}
                  className="w-full h-auto object-contain select-none"
                  decoding="async"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          <div className="prose text-[#001a73] font-sarabun">
            <h2 className="font-prompt font-semibold text-xl">รู้หรือไม่!</h2>
            <p>
              ในญี่ปุ่นมี Community Bus รถเมล์ขนาดเล็กที่วิ่งเข้าซอยและพื้นที่ ที่รถใหญ่เข้าไม่ถึง ค่าโดยสารถูกมาก บางแห่งนั่งได้ทั้งสายเพียง 100 เยน ทำให้ผู้สูงอายุและเด็กเข้าถึงบริการสำคัญ เช่น โรงพยาบาลและศูนย์ชุมชนได้สะดวกขึ้น
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
