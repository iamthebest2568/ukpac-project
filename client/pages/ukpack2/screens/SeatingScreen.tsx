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
  const [totalSeats, setTotalSeats] = useState<number | "">("");
  const [specialSeats, setSpecialSeats] = useState<number | "">("");
  const [pregnantSeats, setPregnantSeats] = useState<number | "">("");
  const [childElderSeats, setChildElderSeats] = useState<number | "">("");
  const [monkSeats, setMonkSeats] = useState<number | "">("");
  const [wheelchairBikeSpaces, setWheelchairBikeSpaces] = useState<number | "">(
    "",
  );
  const [isExitModalOpen, setExitModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorTitle, setErrorTitle] = useState<string>("��้อผิดพลาด");

  const maxByChassis: Record<string, number> = {
    small: 30,
    medium: 40,
    large: 50,
    extra: 12, // รถกระบะดัดแ��ลง 8-12 ที่นั่ง
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
    medium: "รถเมล์มาตรฐาน 30–50 ที��นั่ง",
    large: "รถตู้โดยสาร 9–15 ที่นั่ง",
    extra: "รถกะบะดัดแปลง 8–12 ที่นั่ง",
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
    พัดลม:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdcae7affa4fe43e38aa5c78ca608e39e?format=webp&width=800",
    ที่นั่งพิเศษ:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F788c9e78d6944fc8a5088cc00aa40697?format=webp&width=800",
    หน้าต่างเปิดได้:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F788c9e78d6944fc8a5088cc00aa40697?format=webp&width=800",
    "ที่จับ/ราว���ืนที่ปลอดภั��":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1cae4f7306834a6eb0d86be09e05bfdd?format=webp&width=800",
    "ช��องชาร์จมือถือ/USB":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fba274e72720c4a1b9695e83dbf8c1fe9?format=webp&width=800",
    "Wi‑Fi ฟรี":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F63dc13fe1fab446a9da88bfb297d9c6d?format=webp&width=800",
    "ระบบประกาศบอกป้าย(เสียง/จอ)":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F35b324f49ad84b71a92ae80b0b39f7cd?format=webp&width=800",
    air: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F02548238f8184e808929075a27733533?format=webp&width=800",
    fan: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdcae7affa4fe43e38aa5c78ca608e39e?format=webp&width=800",
    seat: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F788c9e78d6944fc8a5088cc00aa40697?format=webp&width=800",
    wifi: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1cae4f7306834a6eb0d86be09e05bfdd?format=webp&width=800",
    plug: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fba274e72720c4a1b9695e83dbf8c1fe9?format=webp&width=800",
    tv: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F63dc13fe1fab446a9da88bfb297d9c6d?format=webp&width=800",
    cup: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F35b324f49ad84b71a92ae80b0b39f7cd?format=webp&width=800",
  };

  const storedColor = (() => {
    try {
      const raw = sessionStorage.getItem("design.color");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

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

  const handleTotalFocus = () => {
    // Intentionally do not auto-fill or show a number on focus.
    // The field should remain empty so users can type freely.
  };

  React.useEffect(() => {
    // Load saved seating only if it belongs to the currently selected chassis
    try {
      const storedChassis = sessionStorage.getItem("design.chassis");
      const raw = sessionStorage.getItem("design.seating");
      if (raw && storedChassis === selectedChassis) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.totalSeats === "number") {
          // clamp stored total to current chassis bounds
          const clampedTotal = Math.min(
            maxCapacity,
            Math.max(minCapacity, parsed.totalSeats),
          );
          setTotalSeats(clampedTotal);
          setSpecialSeats(parsed.specialSeats ?? "");
          setPregnantSeats(parsed.pregnantSeats ?? "");
          setChildElderSeats(parsed.childElderSeats ?? "");
          setMonkSeats(parsed.monkSeats ?? "");
          setWheelchairBikeSpaces(parsed.wheelchairBikeSpaces ?? "");
          return;
        }
      }
    } catch {
      // ignore parse errors
    }
    // Default to empty so the field shows placeholder and is easy to type into
    setTotalSeats("");
    setSpecialSeats("");
    setPregnantSeats("");
    setChildElderSeats("");
    setMonkSeats("");
    setWheelchairBikeSpaces("");
  }, [selectedChassis, minCapacity, maxCapacity]);

  const selectedLabel = CHASSIS_LABELS[selectedChassis] || "";
  const selectedTopdown = TOPDOWN_IMAGE[selectedChassis];

  const validateSeating = (): boolean => {
    // fixed mapping for chassis ranges
    const mappingMin: Record<string, number> = {
      small: 16,
      medium: 30,
      large: 9,
      extra: 8,
    };
    const mappingMax: Record<string, number> = {
      small: 30,
      medium: 50,
      large: 15,
      extra: 12,
    };

    const minCapacityLocal = mappingMin[selectedChassis] ?? 16;
    const maxCapacityLocal = mappingMax[selectedChassis] ?? 50;

    // Normalize totalSeats to number for inclusive checks
    const total =
      typeof totalSeats === "number"
        ? totalSeats
        : totalSeats === ""
          ? NaN
          : Number(totalSeats);

    if (Number.isNaN(total)) {
      setErrorTitle("กรุณาระบุจำนวนที่นั่งทั้งหมด");
      setErrorMessage(
        `กรุณากรอกจำนวนที่นั่งทั้งหมดในช่วง ${minCapacityLocal} ถึง ${maxCapacityLocal} ที่นั่ง`,
      );
      setErrorModalOpen(true);
      return false;
    }

    // Inclusive range check: total must be >= min and <= max
    if (!(total >= minCapacityLocal && total <= maxCapacityLocal)) {
      const chassisLabel = CHASSIS_LABELS[selectedChassis] || selectedChassis;
      setErrorTitle("จำนวนที่นั่งไม่ถูกต้องสำหรับประเภทรถที่เลือก");
      setErrorMessage(
        `คุณเลือก: ${chassisLabel}. ค่าที่ถูกต้องคือ ${minCapacityLocal} ถึง ${maxCapacityLocal} ที่นั่ง แต่คุณกรอก ${total}`,
      );
      setErrorModalOpen(true);
      return false;
    }

    // Sum sub-fields (treat empty as 0)
    const sSpecial = Number(specialSeats) || 0;
    const sChild = Number(childElderSeats) || 0;
    const sPreg = Number(pregnantSeats) || 0;
    const sMonk = Number(monkSeats) || 0;
    const sWheel = Number(wheelchairBikeSpaces) || 0;

    const sumSubs = sSpecial + sChild + sPreg + sMonk + sWheel;

    if (sumSubs !== total) {
      setErrorTitle("ผลรวมของที่นั่งย่อยไม่ตรงกัน");
      setErrorMessage(
        `ผลรวมของที่นั่งย่อยทั้งหมด (${sumSubs}) ไม่ตรงกับจำนวนที่นั่งทั้งหมด (${total})`,
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

  const handleTotalSeatsChange = (v: number | "") => {
    if (v === "") {
      setTotalSeats("");
      return;
    }
    // During typing we only set a clamped value; final validation happens on Next
    const clamped = Math.min(maxCapacity, Math.max(0, v as number));
    setTotalSeats(clamped);
    // Do not adjust category fields while typing; validate on submit
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

              return (
                <VehiclePreview
                  imageSrc={selectedTopdown}
                  colorFilter={storedColor?.filter}
                  label={
                    <>
                      <span className="chassis-label-mobile">
                        รถ���ี่เลือก :{" "}
                      </span>
                      {selectedLabel}
                    </>
                  }
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
                  placeholder="ระบ��..."
                  value={totalSeats}
                  onFocus={handleTotalFocus}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      handleTotalSeatsChange("");
                      return;
                    }
                    const parsed = Math.min(
                      maxCapacity,
                      Math.max(0, parseInt(raw || "0", 10)),
                    );
                    handleTotalSeatsChange(parsed);
                  }}
                  className="w-24 px-3 py-2 rounded-full text-[#000D59] bg-white text-right"
                  style={{ borderWidth: 3, borderColor: "rgba(0,13,89,1)" }}
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
                  value={specialSeats === "" ? "" : specialSeats}
                  onFocus={() => {
                    if (specialSeats === 0) setSpecialSeats("");
                  }}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      setSpecialSeats("");
                      return;
                    }
                    const parsed = Math.max(
                      0,
                      Math.min(maxCapacity, parseInt(raw || "0", 10)),
                    );
                    setSpecialSeats(parsed);
                  }}
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-full text-[#003366] bg-white text-right"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">
                  เด็ก / ผู้สูงอายุ
                </div>
                <input
                  type="number"
                  value={childElderSeats === "" ? "" : childElderSeats}
                  onFocus={() => {
                    if (childElderSeats === 0) setChildElderSeats("");
                  }}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      setChildElderSeats("");
                      return;
                    }
                    const parsed = Math.max(
                      0,
                      Math.min(maxCapacity, parseInt(raw || "0", 10)),
                    );
                    setChildElderSeats(parsed);
                  }}
                  className="w-24 px-3 py-2 border border-[#e5e7eb] rounded-full text-[#003366] bg-white text-right"
                  min={0}
                  max={maxCapacity}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">
                  สตรีม���ครรภ์
                </div>
                <input
                  type="number"
                  value={pregnantSeats === "" ? "" : pregnantSeats}
                  onFocus={() => {
                    if (pregnantSeats === 0) setPregnantSeats("");
                  }}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      setPregnantSeats("");
                      return;
                    }
                    const parsed = Math.max(
                      0,
                      Math.min(maxCapacity, parseInt(raw || "0", 10)),
                    );
                    setPregnantSeats(parsed);
                  }}
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
                  value={monkSeats === "" ? "" : monkSeats}
                  onFocus={() => {
                    if (monkSeats === 0) setMonkSeats("");
                  }}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      setMonkSeats("");
                      return;
                    }
                    const parsed = Math.max(
                      0,
                      Math.min(maxCapacity, parseInt(raw || "0", 10)),
                    );
                    setMonkSeats(parsed);
                  }}
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
                  value={
                    wheelchairBikeSpaces === "" ? "" : wheelchairBikeSpaces
                  }
                  onFocus={() => {
                    if (wheelchairBikeSpaces === 0) setWheelchairBikeSpaces("");
                  }}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      setWheelchairBikeSpaces("");
                      return;
                    }
                    const parsed = Math.max(
                      0,
                      Math.min(maxCapacity, parseInt(raw || "0", 10)),
                    );
                    setWheelchairBikeSpaces(parsed);
                  }}
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
        message="คุณแน่ใจหรื��ไม่ว่าต้องการออก? การเปลี่ยนแปลงของคุณจะไม่ถูกบันทึก"
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
