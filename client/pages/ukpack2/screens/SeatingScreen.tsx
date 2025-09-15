import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SelectionCard from "../components/SelectionCard";
import CtaButton from "../components/CtaButton";
import ConfirmModal from "../components/ConfirmModal";
import ErrorModal from "../components/ErrorModal";
import { useBusDesign } from "../context/BusDesignContext";
import StepTabs from "../components/StepTabs";

const SeatingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useBusDesign();
  const [totalSeats, setTotalSeats] = useState<number>(40);
  const [pregnantSeats, setPregnantSeats] = useState<number>(0);
  const [childElderSeats, setChildElderSeats] = useState<number>(0);
  const [monkSeats, setMonkSeats] = useState<number>(0);
  const [wheelchairBikeSpaces, setWheelchairBikeSpaces] = useState<number>(0);
  const [isExitModalOpen, setExitModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);

  const maxByChassis: Record<string, number> = {
    small: 30,
    medium: 40,
    large: 50,
    extra: 51,
  };
  const currentChassis = state.chassis || "medium";

  const CHASSIS_LABELS: Record<string, string> = {
    small: "รถเมล์ขนาดเล็ก 16–30 ที่นั่ง",
    medium: "รถเมล์ขนาดกลาง 31–40 ที่นั่ง",
    large: "รถเมล์ขนาดใหญ่ 41–50 ที่นั่ง",
    extra: "รถเมล์รุ่นพิเศษ 51+ ที่นั่ง",
  };

  const TOPDOWN_IMAGE: Record<string, string | undefined> = {
    small:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9ab4a85f41e64448b6ce79942def8a26?format=webp&width=800",
    medium:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff5741ea88d0b4d94a8cc687f16501d5c?format=webp&width=800",
    large:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F2f4b32b5e79d4f20ba02c9d2ac0c9835?format=webp&width=800",
    extra:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F48d410fc189e450d8a6da8ed130f71a7?format=webp&width=800",
  };

  const selectedChassis = React.useMemo(() => {
    try {
      const saved = sessionStorage.getItem("design.chassis");
      return (saved || currentChassis) as keyof typeof CHASSIS_LABELS;
    } catch {
      return currentChassis as keyof typeof CHASSIS_LABELS;
    }
  }, [currentChassis]);

  const maxCapacity = maxByChassis[selectedChassis] ?? 50;
  React.useEffect(() => {
    setTotalSeats(maxCapacity);
  }, [maxCapacity]);

  const selectedLabel = CHASSIS_LABELS[selectedChassis] || "";
  const selectedTopdown = TOPDOWN_IMAGE[selectedChassis];

  const handleNext = () => {
    try {
      const seating = {
        totalSeats,
        pregnantSeats,
        childElderSeats,
        monkSeats,
        wheelchairBikeSpaces,
      };
      sessionStorage.setItem("design.seating", JSON.stringify(seating));
    } catch (e) {}
    navigate("/ukpack2/amenities");
  };

  const handleTotalSeatsChange = (v: number) => {
    setTotalSeats(v);
    if (v > maxCapacity) {
      setErrorModalOpen(true);
    }
  };

  return (
    <>
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
            {selectedTopdown ? (
              <img
                src={selectedTopdown}
                alt={`ผังที่นั่งมุมมองบน - ${selectedLabel}`}
                className="h-48 w-auto object-contain select-none"
                decoding="async"
                loading="eager"
              />
            ) : (
              <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">
                Top-down seat map preview (ภาพสำหรับรุ่นนี้จะถูกเพิ่มภายหลัง)
              </div>
            )}
            <p className="mt-1 font-prompt font-semibold text-[#001a73] text-center">
              รถที่ใช้งาน : {selectedLabel}
            </p>
          </div>
          <div className="bg-white rounded-t-3xl -mt-2 p-4">
            <StepTabs active={2} />
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun">
                  จำนวนที่นั่งทั้งหมด
                </div>
                <input
                  type="number"
                  placeholder="พิมพ์"
                  value={totalSeats}
                  onChange={(e) =>
                    handleTotalSeatsChange(
                      Math.min(
                        maxCapacity,
                        Math.max(0, parseInt(e.target.value || "0", 10)),
                      ),
                    )
                  }
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-md text-[#003366] bg-white text-right"
                  min={0}
                  max={maxCapacity}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun">สตรีมีครรภ์</div>
                <input
                  type="number"
                  value={pregnantSeats}
                  onChange={(e) =>
                    setPregnantSeats(
                      Math.min(
                        maxCapacity,
                        Math.max(0, parseInt(e.target.value || "0", 10)),
                      ),
                    )
                  }
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-md text-[#003366] bg-white text-right"
                  min={0}
                  max={maxCapacity}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun">
                  เด็ก / ผู้สูงอายุ
                </div>
                <input
                  type="number"
                  value={childElderSeats}
                  onChange={(e) =>
                    setChildElderSeats(
                      Math.min(
                        maxCapacity,
                        Math.max(0, parseInt(e.target.value || "0", 10)),
                      ),
                    )
                  }
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-md text-[#003366] bg-white text-right"
                  min={0}
                  max={maxCapacity}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun">พระภิกษุสงฆ์</div>
                <input
                  type="number"
                  value={monkSeats}
                  onChange={(e) =>
                    setMonkSeats(
                      Math.min(
                        maxCapacity,
                        Math.max(0, parseInt(e.target.value || "0", 10)),
                      ),
                    )
                  }
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-md text-[#003366] bg-white text-right"
                  min={0}
                  max={maxCapacity}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun">
                  พื้นที่สำหรับรถเข็น/จักรยาน
                </div>
                <input
                  type="number"
                  value={wheelchairBikeSpaces}
                  onChange={(e) =>
                    setWheelchairBikeSpaces(
                      Math.min(
                        maxCapacity,
                        Math.max(0, parseInt(e.target.value || "0", 10)),
                      ),
                    )
                  }
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-md text-[#003366] bg-white text-right"
                  min={0}
                  max={maxCapacity}
                />
              </div>
            </div>
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

      <ErrorModal
        isOpen={isErrorModalOpen}
        title="ความจุเกิน"
        message={`จำนวนที่นั่งทั้งหมดเกินความจุสูงสุดของรถ (${maxCapacity}) กรุณาตรวจสอบ`}
        onClose={() => setErrorModalOpen(false)}
      />
    </>
  );
};

export default SeatingScreen;
