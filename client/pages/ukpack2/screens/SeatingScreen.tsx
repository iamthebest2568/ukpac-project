import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SelectionCard from "../components/SelectionCard";
import CtaButton from "../components/CtaButton";
import ConfirmModal from "../components/ConfirmModal";
import ErrorModal from "../components/ErrorModal";
import { useBusDesign } from "../context/BusDesignContext";
import StepTabs from "../components/StepTabs";
import VehiclePreview from "../components/VehiclePreview";

const SeatingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useBusDesign();
  const [totalSeats, setTotalSeats] = useState<number>(40);
  const [pregnantSeats, setPregnantSeats] = useState<number>(0);
  const [childElderSeats, setChildElderSeats] = useState<number>(0);
  const [monkSeats, setMonkSeats] = useState<number>(0);
  const [wheelchairBikeSpaces, setWheelchairBikeSpaces] = useState<number>(0);
  const [specialSeats, setSpecialSeats] = useState<number>(0);
  const [isExitModalOpen, setExitModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorTitle, setErrorTitle] = useState<string>("ข้อผิดพลาด");

  const maxByChassis: Record<string, number> = {
    small: 30,
    medium: 40,
    large: 50,
    extra: 12, // รถกระบะดัดแปลง 8-12 ที่นั่ง
  };

  const minByChassis: Record<string, number> = {
    small: 16,
    medium: 31,
    large: 41,
    extra: 8,
  };
  const currentChassis = state.chassis || "medium";

  const CHASSIS_LABELS: Record<string, string> = {
    small: "รถเมล์ขนาดเล็ก 16–30 ที่นั่ง",
    medium: "รถเมล์มาตรฐาน 30–50 ที่นั่ง",
    large: "รถเมล์ขนาดใหญ่ 41–50 ที่นั่ง",
    extra: "รถกระบะดัดแปลง 8-12 ที่นั่ง",
  };

  const TOPDOWN_IMAGE: Record<string, string | undefined> = {
    small:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1edb1ed85aec48c6a1e0038571e30e65?format=webp&width=800",
    medium:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F73290cccaa1e4cdf9f792f604d6d26f8?format=webp&width=800",
    large:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F0e0a9ca0a43c44f08ea42b45b01cf243?format=webp&width=800",
    extra:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F16775ed18f2a4cd2ad40106fb2f788b6?format=webp&width=800",
  };

  const OVERLAY_ICON_SRC: Record<string, string> = {
    แอร์: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F02548238f8184e808929075a27733533?format=webp&width=800",
    พัดลม: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdcae7affa4fe43e38aa5c78ca608e39e?format=webp&width=800",
    ที่นั่งพิเศษ: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F788c9e78d6944fc8a5088cc00aa40697?format=webp&width=800",
    "หน้าต่างเปิดได้": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F788c9e78d6944fc8a5088cc00aa40697?format=webp&width=800",
    "ที่จับ/ราวยืนที่ปลอดภัย": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1cae4f7306834a6eb0d86be09e05bfdd?format=webp&width=800",
    "ช่องชาร์จมือถือ/USB": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fba274e72720c4a1b9695e83dbf8c1fe9?format=webp&width=800",
    "Wi‑Fi ฟรี": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F63dc13fe1fab446a9da88bfb297d9c6d?format=webp&width=800",
    "ระบบประกาศบอกป้าย(เสียง/จอ)": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F35b324f49ad84b71a92ae80b0b39f7cd?format=webp&width=800",
    air: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F02548238f8184e808929075a27733533?format=webp&width=800",
    fan: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdcae7affa4fe43e38aa5c78ca608e39e?format=webp&width=800",
    seat: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F788c9e78d6944fc8a5088cc00aa40697?format=webp&width=800",
    wifi: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1cae4f7306834a6eb0d86be09e05bfdd?format=webp&width=800",
    plug: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fba274e72720c4a1b9695e83dbf8c1fe9?format=webp&width=800",
    tv: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F63dc13fe1fab446a9da88bfb297d9c6d?format=webp&width=800",
    cup: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F35b324f49ad84b71a92ae80b0b39f7cd?format=webp&width=800",
  };

  const selectedChassis = React.useMemo(() => {
    // Prefer in-memory state (BusDesignContext) so selections are immediate.
    if (state.chassis) return state.chassis as keyof typeof CHASSIS_LABELS;
    try {
      const saved = sessionStorage.getItem("design.chassis");
      if (saved) return saved as keyof typeof CHASSIS_LABELS;
    } catch {
      // ignore
    }
    return currentChassis as keyof typeof CHASSIS_LABELS;
  }, [state.chassis, currentChassis]);

  const maxCapacity = maxByChassis[selectedChassis] ?? 50;
  const minCapacity = minByChassis[selectedChassis] ?? 16;

  React.useEffect(() => {
    // Set initial seats to a reasonable default between min and max
    const defaultSeats =
      selectedChassis === "extra"
        ? 10
        : Math.ceil((minCapacity + maxCapacity) / 2);
    setTotalSeats(defaultSeats);
  }, [selectedChassis, minCapacity, maxCapacity]);

  const selectedLabel = CHASSIS_LABELS[selectedChassis] || "";
  const selectedTopdown = TOPDOWN_IMAGE[selectedChassis];

  const validateSeating = (): boolean => {
    const minCapacity = minByChassis[selectedChassis] ?? 16;
    const specialSeatsTotal =
      pregnantSeats + childElderSeats + monkSeats + wheelchairBikeSpaces;

    // Check if total seats is within range
    if (totalSeats < minCapacity) {
      setErrorTitle("จำนวนที่นั่งน้อยเกินไป");
      setErrorMessage(
        `รถประเภทนี้ต้องมีที่นั่งอย่างน้อย ${minCapacity} ที่นั่ง กรุณาเพิ่มจำนวนที่นั่ง`,
      );
      setErrorModalOpen(true);
      return false;
    }

    if (totalSeats > maxCapacity) {
      setErrorTitle("จำนวนที่นั่งเกินขีดจำกัด");
      setErrorMessage(
        `รถประเภทนี้สามารถมีที่นั่งได้สูงสุด ${maxCapacity} ที่นั่ง กรุณาลดจำนวนที่นั่ง`,
      );
      setErrorModalOpen(true);
      return false;
    }

    // Check if special seats exceed total seats
    if (specialSeatsTotal > totalSeats) {
      setErrorTitle("พื้นที่ไม่เพียงพอ");
      setErrorMessage(
        `ที่นั่งพิเศษทั้งหมด (${specialSeatsTotal} ที่นั่ง) เกินจำนวนที่นั่งทั้งหมด (${totalSeats} ที่นั่ง) กรุณาลดจำนวนที่นั่งบางส่วน`,
      );
      setErrorModalOpen(true);
      return false;
    }

    // Ensure the explicit "จำนวนที่นั่งพิเศษ" covers the sum of special categories
    if (specialSeats < specialSeatsTotal) {
      setErrorTitle("จำนวนที่นั่งพิเศษไม่พอ");
      setErrorMessage(
        `จำนวนที่นั่งพิเศษ (${specialSeats}) น้อยกว่าจำนวนที่นั่งพิเศษย่อย (${specialSeatsTotal}) กรุณาปรับค่าหรือลดจำนวนที่นั่งพิเศษย่อย`,
      );
      setErrorModalOpen(true);
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateSeating()) {
      return;
    }

    try {
      const seating = {
        totalSeats,
        specialSeats,
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
    const minCapacity = minByChassis[selectedChassis] ?? 16;
    setTotalSeats(v);

    if (v > maxCapacity) {
      setErrorTitle("จำนวนที่นั่งเกินขีดจำกัด");
      setErrorMessage(
        `รถประเภทนี้สามารถมีที่นั่งได้สูงสุด ${maxCapacity} ที่นั่ง กรุณาลดจำนวนที่นั่ง`,
      );
      setErrorModalOpen(true);
    } else if (v < minCapacity && v > 0) {
      setErrorTitle("จำนวนที่นั่งน้อยเกินไป");
      setErrorMessage(
        `รถประเภทนี้ต้องมีที่นั่งอย่างน้อย ${minCapacity} ที่นั่ง กรุณาเพิ่มจำนวนที่นั่ง`,
      );
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
                    : parsed?.doorChoice || (parsed?.hasRamp ? "ramp" : parsed?.highLow ? "emergency" : null);
                } catch {
                  return sessionStorage.getItem("design.doors");
                }
              })();

              const overlay = [
                ...(amenities || []),
                ...(payments || []),
                ...(doors ? [doors as string] : []),
              ];

              return (
                <VehiclePreview
                  imageSrc={selectedTopdown}
                  label={<><span className="chassis-label-mobile">รถที่เลือก : </span>{selectedLabel}</>}
                  overlayLabels={overlay}
                  overlayIconMap={OVERLAY_ICON_SRC}
                />
              );
            })()}
          </div>
          <div className="bg-white rounded-t-3xl -mt-2 p-4">
            <StepTabs active={2} />
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">
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
                  className="w-24 px-3 py-2 border-2 border-[rgba(0,13,89,1)] sm:border sm:border-[#e5e7eb] rounded-full text-[#003366] bg-white text-right"
                  min={0}
                  max={maxCapacity}
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">
                  จำนวนที่นั่งพิเศษ
                </div>
                <input
                  id="specialSeats"
                  type="number"
                  min={0}
                  max={maxCapacity}
                  value={specialSeats}
                  onChange={(e) =>
                    setSpecialSeats(
                      Math.min(
                        maxCapacity,
                        Math.max(0, parseInt(e.target.value || "0", 10)),
                      ),
                    )
                  }
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-full text-[#003366] bg-white text-right"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">
                  สตรีมีครรภ์
                </div>
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
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-full text-[#003366] bg-white text-right"
                  min={0}
                  max={maxCapacity}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">
                  เด็��� / ผู้สูงอายุ
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
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-full text-[#003366] bg-white text-right"
                  min={0}
                  max={maxCapacity}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">
                  พระภิกษุสงฆ์
                </div>
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
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-full text-[#003366] bg-white text-right"
                  min={0}
                  max={maxCapacity}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">
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
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-full text-[#003366] bg-white text-right"
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
        title={errorTitle}
        message={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </>
  );
};

export default SeatingScreen;
