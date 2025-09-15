import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SelectionCard from "../components/SelectionCard";
import CtaButton from "../components/CtaButton";
import StepTabs from "../components/StepTabs";

const IconDoor1 = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F64fd535257924608b5904905f56ec3a2?format=webp&width=800"
    alt="ประตู 1"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconDoor2 = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F19aa75bc89c544e28a2d10840108af23?format=webp&width=800"
    alt="ประตู 2"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconRamp = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F38de4d577fa346a985827c9da650fd69?format=webp&width=800"
    alt="ทางสำหรับรถเข็น/ผู้พิการ"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconHighLow = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F0a17fe8444b34725b19cc5a62c0da84b?format=webp&width=800"
    alt="ประตูฉุกเฉิน"
    className="h-8 w-8 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);

const DoorScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string>(() => {
    try {
      const raw = sessionStorage.getItem("design.doors");
      if (!raw) return "1";
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string") return parsed;
      if (parsed && typeof parsed === "object") {
        if (parsed.doorChoice) return parsed.doorChoice as string;
        if (parsed.hasRamp) return "ramp";
        if (parsed.highLow) return "emergency";
      }
    } catch (e) {
      // ignore
    }
    return "1";
  });

  const handleNext = () => {
    try {
      // store single selected option (string) for doors
      sessionStorage.setItem("design.doors", JSON.stringify(selectedOption));
    } catch (e) {}
    navigate("/ukpack2/design");
  };

  return (
    <CustomizationScreen
      title="ปรับแต่งรถเมล์ของคุณ"
      theme="light"
      footerContent={
        <div className="flex justify-center">
          <CtaButton text="ถัดไป" onClick={handleNext} />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="w-full rounded-md flex flex-col items-center justify-center gap-2">
          {(() => {
            const CHASSIS_LABELS: Record<string, string> = {
              small: "รถเมล์ขนาดเล็ก 16–30 ที่นั่ง",
              medium: "รถเมล์ขนาดกลาง 31–40 ที่นั่ง",
              large: "รถเมล์ขนาดใหญ่ 41-50 ที่นั่ง",
              extra: "รถเมล์รุ่นพิเศษ 51+ ที่นั่ง",
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
            let selected = "medium";
            try {
              const saved = sessionStorage.getItem("design.chassis");
              if (saved) selected = saved;
            } catch (e) {}
            const label = CHASSIS_LABELS[selected] || "";
            const img = HERO_IMAGE[selected];
            return img ? (
              <>
                <img
                  src={img}
                  alt={`ภาพรถ - ${label}`}
                  className="h-48 w-auto object-contain select-none"
                  decoding="async"
                  loading="eager"
                />
                <p className="mt-1 font-prompt font-semibold text-[#001a73] text-center">
                  รถที่ใช้งาน : {label}
                </p>
              </>
            ) : (
              <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">
                Bus image preview
              </div>
            );
          })()}
        </div>
        <div className="bg-white rounded-t-3xl -mt-2 p-4">
          <StepTabs active={5} />

          <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">
            ประตู
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Radio group for 1 or 2 doors */}
            <SelectionCard
              icon={<IconDoor1 />}
              label={"1 ประตู"}
              isSelected={selectedOption === "1"}
              onClick={() => setSelectedOption("1")}
              variant="light"
            />
            <SelectionCard
              icon={<IconDoor2 />}
              label={"2 ประตู"}
              isSelected={selectedOption === "2"}
              onClick={() => setSelectedOption("2")}
              variant="light"
            />

            {/* Single-choice options */}
            <SelectionCard
              icon={<IconRamp />}
              label={"ทางลาดสำหรับรถเข็น/ผู้พิการ"}
              isSelected={selectedOption === "ramp"}
              onClick={() => setSelectedOption("ramp")}
              variant="light"
            />
            <SelectionCard
              icon={<IconHighLow />}
              label={"ประตูฉุกเฉิน"}
              isSelected={selectedOption === "emergency"}
              onClick={() => setSelectedOption("emergency")}
              variant="light"
            />
          </div>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default DoorScreen;
