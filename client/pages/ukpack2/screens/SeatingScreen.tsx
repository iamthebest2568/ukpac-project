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
    extra: 70,
  };
  const currentChassis = state.chassis || "medium";
  const maxCapacity = maxByChassis[currentChassis] ?? 50;

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
        onBack={() => setExitModalOpen(true)}
        theme="light"
        footerContent={
          <div className="flex justify-center">
            <CtaButton text="ถัดไป" onClick={handleNext} />
          </div>
        }
      >
        <div className="space-y-6">
          <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">
            Top-down seat map preview
          </div>
          <div className="bg-white rounded-t-3xl -mt-2 p-4">
            <StepTabs active={2} />
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun">จำนวนที่นั่งทั้งหมด</div>
                <input
                  type="number"
                  placeholder="พิมพ์"
                  value={totalSeats}
                  onChange={(e) => handleTotalSeatsChange(Math.max(0, parseInt(e.target.value || '0', 10)))}
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-md text-[#003366] bg-white text-right"
                  min={0}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun">สตรีมีครรภ์</div>
                <input
                  type="number"
                  value={pregnantSeats}
                  onChange={(e) => setPregnantSeats(Math.max(0, parseInt(e.target.value || '0', 10)))}
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-md text-[#003366] bg-white text-right"
                  min={0}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun">เด็ก / ผู้สูงอายุ</div>
                <input
                  type="number"
                  value={childElderSeats}
                  onChange={(e) => setChildElderSeats(Math.max(0, parseInt(e.target.value || '0', 10)))}
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-md text-[#003366] bg-white text-right"
                  min={0}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun">พระภิกษุสงฆ์</div>
                <input
                  type="number"
                  value={monkSeats}
                  onChange={(e) => setMonkSeats(Math.max(0, parseInt(e.target.value || '0', 10)))}
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-md text-[#003366] bg-white text-right"
                  min={0}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun">พื้นที่สำหรับรถเข็น/จักรยาน</div>
                <input
                  type="number"
                  value={wheelchairBikeSpaces}
                  onChange={(e) => setWheelchairBikeSpaces(Math.max(0, parseInt(e.target.value || '0', 10)))}
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-md text-[#003366] bg-white text-right"
                  min={0}
                />
              </div>
            </div>
          </div>
        </div>
      </CustomizationScreen>

      <ConfirmModal
        isOpen={isExitModalOpen}
        title="ออก���ากหน้าจอ"
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
