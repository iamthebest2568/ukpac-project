import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import ConfirmModal from "../components/ConfirmModal";

const CHASSIS_LABELS: Record<string, string> = {
  small: "รถเมล์ขนาดเล็ก 16–30 ที่นั่ง",
  medium: "รถเมล์ขนาดกลาง 31–40 ที่นั่ง",
  large: "รถเมล์ขนาดใหญ่ 41–50 ที่นั่ง",
  extra: "รถกระบ���ดัดแปลง 8–12 ที่นั่ง",
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
            <div
              className="relative w-full flex items-center justify-center"
              style={{ minHeight: "160px" }}
            >
              <img
                src={HERO_SHADOW}
                alt="เงารถ"
                className="absolute bottom-0 w-[72%] max-w-[420px] pointer-events-none select-none"
                decoding="async"
                loading="eager"
                aria-hidden="true"
              />
              <div className="relative w-[72%] max-w-[420px]">
                {(() => {
                  const amenities = (() => {
                    try {
                      const raw = sessionStorage.getItem("design.amenities");
                      return raw ? (JSON.parse(raw) as string[]) : [];
                    } catch {
                      return [] as string[];
                    }
                  })();
                  const payments = (() => {
                    try {
                      const raw = sessionStorage.getItem("design.payment");
                      return raw ? (JSON.parse(raw) as string[]) : [];
                    } catch {
                      return [] as string[];
                    }
                  })();
                  const doors = (() => {
                    try {
                      const raw = sessionStorage.getItem("design.doors");
                      if (!raw) return null;
                      const parsed = JSON.parse(raw);
                      return typeof parsed === "string"
                        ? parsed
                        : parsed?.doorChoice ||
                            (parsed?.hasRamp
                              ? "ramp"
                              : parsed?.highLow
                                ? "emergency"
                                : null);
                    } catch {
                      return sessionStorage.getItem("design.doors");
                    }
                  })();
                  const overlay = [
                    ...(amenities || []),
                    ...(payments || []),
                    ...(doors ? [doors as string] : []),
                  ];
                  const ICONS: Record<string, string> = {
                    เงินสด:
                      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbc8b22cedfbb4640a702f724881f196d?format=webp&width=800",
                    สแกนจ่าย:
                      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb8992da4be824b339d3df5f0a076ed93?format=webp&width=800",
                    "สแกนจ่าย 2":
                      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F56620e798eb94153b2390271f30d0dae?format=webp&width=800",
                    แตะบัตร:
                      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdb2e47a586b841d1af014e9196f3c411?format=webp&width=800",
                    กระเป๋ารถเมล์:
                      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F41c089c5dd4b448993c4e02c02cdf7ac?format=webp&width=800",
                    "ตั๋วรายเดือน/รอบ":
                      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fca6467eff0c74a77a8e5757f25a24e41?format=webp&width=800",
                    "1": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9811f9bca05c43feae9eafdcbab3c8d9?format=webp&width=800",
                    "2": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8f9b21942af243b3b80b0e5ac8b12631?format=webp&width=800",
                    ramp: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fece2b6fc843340f0997f2fd7d3ca0aea?format=webp&width=800",
                    emergency:
                      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F98de0624be3d4ae6b96d83edcf8891f9?format=webp&width=800",
                  };
                  return overlay.length > 0 ? (
                    <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 flex flex-wrap justify-center gap-2 z-20 max-w-[80%]">
                      {overlay.map((lab, i) => (
                        <div
                          key={`${lab}-${i}`}
                          className="bg-white/95 backdrop-blur rounded-full shadow-md h-9 w-9 md:h-10 md:w-10 flex items-center justify-center ring-1 ring-black/10"
                        >
                          {ICONS[lab] ? (
                            <img
                              src={ICONS[lab]}
                              alt={lab}
                              className="h-6 w-6 md:h-7 md:w-7 object-contain"
                            />
                          ) : (
                            <div className="text-xs">{lab}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null;
                })()}
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
              ในญี่ปุ่นมี Community Bus รถเมล์ขนาดเล็กที่วิ่งเข้าซอยและพื้นที่
              ที่รถใหญ่เข้าไม่ถึง ค่าโดยสารถูกมาก บางแห่งนั่งได้ทั้งสายเพียง
              100 เยน ทำให้ผู้สูงอายุและเด็กเข้าถึงบริการสำคัญ เช่น
              โรงพยาบาลและศูนย์ชุมชนได้สะดวกขึ้น
            </p>
          </div>
        </div>
      </CustomizationScreen>

      <ConfirmModal
        isOpen={isExitModalOpen}
        title="ออกจากหน้าจอ"
        message="คุณแน่ใจหรือไม่ว่าต้องการออก? การเปลี่ยนแปลงของคุ��จะไม่ถูกบันทึก"
        onConfirm={() => navigate("/")}
        onCancel={() => setExitModalOpen(false)}
      />
    </>
  );
};

export default InfoScreen;
