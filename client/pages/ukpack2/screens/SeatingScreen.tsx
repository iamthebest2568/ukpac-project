import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import StepTabs from "../components/StepTabs";
import ConfirmModal from "../components/ConfirmModal";
import ErrorModal from "../components/ErrorModal";
import { useBusDesign } from "../context/BusDesignContext";
import VehiclePreview from "../components/VehiclePreview";
import NumericPlaceholderInput from "../components/NumericPlaceholderInput";
import styles from "./chassis.module.css";

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

const CHASSIS_LABELS: Record<string, string> = {
  small: "รถเมล์ขนาดเล็ก 16–30 ที่นั่ง",
  medium: "รถเมล์มาตรฐาน 30–50 ที่นั่ง",
  large: "รถตู้โดยสาร 9–15 ที่นั่ง",
  extra: "รถกะบะดัดแปลง 8–12 ที่นั่ง",
};

const SeatingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useBusDesign();

  const [totalSeats, setTotalSeats] = useState<number | "">("");
  const [specialSeats, setSpecialSeats] = useState<number | "">("");
  const [pregnantSeats, setPregnantSeats] = useState<number | "">("");
  const [childElderSeats, setChildElderSeats] = useState<number | "">("");
  const [monkSeats, setMonkSeats] = useState<number | "">("");
  const [wheelchairBikeSpaces, setWheelchairBikeSpaces] = useState<number | "">("");

  const [isExitModalOpen, setExitModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTitle, setErrorTitle] = useState("ข้อผิดพลาด");

  const maxByChassis: Record<string, number> = { small: 30, medium: 40, large: 50, extra: 12 };
  const minByChassis: Record<string, number> = { small: 16, medium: 31, large: 41, extra: 8 };

  const currentChassis = state.chassis || "medium";

  const selectedChassis = useMemo(() => {
    if (state.chassis) return state.chassis as keyof typeof CHASSIS_LABELS;
    try {
      const saved = sessionStorage.getItem("design.chassis");
      if (saved) return saved as keyof typeof CHASSIS_LABELS;
    } catch {}
    return currentChassis as keyof typeof CHASSIS_LABELS;
  }, [state.chassis, currentChassis]);

  const maxCapacity = maxByChassis[selectedChassis] ?? 50;
  const minCapacity = minByChassis[selectedChassis] ?? 16;

  const selectedLabel = CHASSIS_LABELS[selectedChassis] || "";
  const selectedTopdown = TOPDOWN_IMAGE[selectedChassis];

  useEffect(() => {
    try {
      const storedChassis = sessionStorage.getItem("design.chassis");
      const raw = sessionStorage.getItem("design.seating");
      if (raw && storedChassis === selectedChassis) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.totalSeats === "number") {
          const clampedTotal = Math.min(maxCapacity, Math.max(minCapacity, parsed.totalSeats));
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
      // ignore
    }
    setTotalSeats("");
    setSpecialSeats("");
    setPregnantSeats("");
    setChildElderSeats("");
    setMonkSeats("");
    setWheelchairBikeSpaces("");
  }, [selectedChassis, minCapacity, maxCapacity]);


  const validateSeating = (): boolean => {
    const mappingMin: Record<string, number> = { small: 16, medium: 30, large: 9, extra: 8 };
    const mappingMax: Record<string, number> = { small: 30, medium: 50, large: 15, extra: 12 };
    const minCapacityLocal = mappingMin[selectedChassis] ?? 16;
    const maxCapacityLocal = mappingMax[selectedChassis] ?? 50;
    const total = typeof totalSeats === "number" ? totalSeats : totalSeats === "" ? NaN : Number(totalSeats);

    if (Number.isNaN(total)) {
      setErrorTitle("กรุณาระบุจำนวนที่นั่งทั้งหมด");
      setErrorMessage(`กรุณากรอกจำนวนที่นั่งทั้งหมดในช่วง ${minCapacityLocal} ถึง ${maxCapacityLocal} ที���นั่ง`);
      setErrorModalOpen(true);
      return false;
    }

    if (!(total >= minCapacityLocal && total <= maxCapacityLocal)) {
      const chassisLabel = CHASSIS_LABELS[selectedChassis] || selectedChassis;
      setErrorTitle("จำนวนที่นั่งไม่ถูกต้องสำหรับประเภทรถที่เลือก");
      setErrorMessage(`คุณเลือก: ${chassisLabel}. ค่าที่ถูกต้องคือ ${minCapacityLocal} ถึง ${maxCapacityLocal} ที่นั่ง แต่คุณกรอก ${total}`);
      setErrorModalOpen(true);
      return false;
    }

    const sSpecial = Number(specialSeats) || 0;
    const sChild = Number(childElderSeats) || 0;
    const sPreg = Number(pregnantSeats) || 0;
    const sMonk = Number(monkSeats) || 0;
    const sWheel = Number(wheelchairBikeSpaces) || 0;
    const sumSubs = sSpecial + sChild + sPreg + sMonk + sWheel;
    if (sumSubs !== total) {
      setErrorTitle("ผลรวมของที่นั่งย่อยไม่ตรงกัน");
      setErrorMessage(`ผลรวมของที่นั่งย่อยทั้งหมด (${sumSubs}) ไม่ตรงกับจำนวนที่นั่งทั้งหมด (${total})`);
      setErrorModalOpen(true);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateSeating()) return;
    try {
      const seating = { totalSeats, specialSeats, pregnantSeats, childElderSeats, monkSeats, wheelchairBikeSpaces };
      sessionStorage.setItem("design.seating", JSON.stringify(seating));
    } catch (e) {
      // ignore
    }
    navigate("/ukpack2/amenities");
  };

  const handleTotalSeatsChange = (v: number | "") => {
    if (v === "") { setTotalSeats(""); return; }
    const clamped = Math.min(maxCapacity, Math.max(0, v as number));
    setTotalSeats(clamped);
  };

  const overlay = (() => {
    try {
      const a = sessionStorage.getItem("design.amenities");
      const p = sessionStorage.getItem("design.payment");
      const d = sessionStorage.getItem("design.doors");
      const amenities = a ? JSON.parse(a) : [];
      const payments = p ? JSON.parse(p) : [];
      let door: string | null = null;
      if (d) {
        try {
          const parsed = JSON.parse(d);
          door = typeof parsed === "string" ? parsed : parsed?.doorChoice || (parsed?.hasRamp ? "ramp" : parsed?.highLow ? "emergency" : null);
        } catch {
          door = d;
        }
      }
      return [...(amenities || []), ...(payments || []), ...(door ? [door] : [])];
    } catch {
      return [] as string[];
    }
  })();

  return (
    <div>
      <CustomizationScreen title="ปรับแต่งรถเมล์าของคุณ" theme="light" fullWidth footerContent={<div className="flex justify-center"><CtaButton text="ถัดไป" onClick={handleNext} /></div>}>
        <div className={styles.contentGrid}>
          <div className={styles.previewWrapper}>
            <div className={styles.previewInner}>
              <div style={{ position: "relative" }}>
                <VehiclePreview imageSrc={selectedTopdown} label={selectedLabel} showSelectedText overlayLabels={overlay} overlayIconMap={{}} colorHex={null} />
              </div>
            </div>
          </div>

          <section className={`${styles.controlsSection} ${styles.controlsWrapper}`}>
            <div className={styles.tabsWrapper}>
              <StepTabs active={2} />
            </div>

            <div className={styles.controlsBox}>
              <div className={styles.controlsContent}>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">จำ��วนที่นั่งทั้งหมด</div>
                    <input
                      type="number"
                      placeholder="พิมพ์"
                      value={totalSeats}
                      onFocus={(e) => { e.currentTarget.placeholder = ''; }}
                      onBlur={(e) => { if (e.currentTarget.value === '') e.currentTarget.placeholder = 'พิมพ์'; }}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") { handleTotalSeatsChange(""); return; }
                        const parsed = Math.min(maxCapacity, Math.max(0, parseInt(raw || "0", 10)));
                        handleTotalSeatsChange(parsed);
                      }}
                      className="w-24 px-3 py-2 rounded-full text-[#000D59] bg-white text-right font-sarabun text-[17.6px]"
                      style={{ borderWidth: 2, borderColor: '#000D59' }}
                      min={0}
                      max={maxCapacity}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">จำนวนที่นั่งพิเศษ</div>
                    <NumericPlaceholderInput id="specialSeats" value={specialSeats} onChange={(v) => setSpecialSeats(v)} min={0} max={maxCapacity} className="w-24 px-3 py-2 text-[#003366] bg-transparent text-right font-sarabun text-[17.6px] outline-none" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">เด็ก / ผู้สูงอายุ</div>
                    <NumericPlaceholderInput value={childElderSeats} onChange={(v) => setChildElderSeats(v)} min={0} max={maxCapacity} className="w-24 px-3 py-2 text-[#003366] bg-transparent text-right font-sarabun text-[17.6px] outline-none" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">สตรีมีครรภ์</div>
                    <NumericPlaceholderInput value={pregnantSeats} onChange={(v) => setPregnantSeats(v)} min={0} max={maxCapacity} className="w-24 px-3 py-2 text-[#003366] bg-transparent text-right font-sarabun text-[17.6px] outline-none" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">พระภิกษุสงฆ์</div>
                    <NumericPlaceholderInput value={monkSeats} onChange={(v) => setMonkSeats(v)} min={0} max={maxCapacity} className="w-24 px-3 py-2 text-[#003366] bg-transparent text-right font-sarabun text-[17.6px] outline-none" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[#003366] font-sarabun font-semibold text-[17.6px]">พื้นที่สำหรับรถเข็น/จักรยาน</div>
                    <NumericPlaceholderInput value={wheelchairBikeSpaces} onChange={(v) => setWheelchairBikeSpaces(v)} min={0} max={maxCapacity} className="w-24 px-3 py-2 text-[#003366] bg-transparent text-right font-sarabun text-[17.6px] outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </CustomizationScreen>

      <ConfirmModal isOpen={isExitModalOpen} title="ออกจากหน้าจอ" message="คุณแน่ใจหรือไม่ว่าต้องการออก? การเปลี่ยนแปลงของคุณจะไม่ถูกบันทึก" onConfirm={() => navigate("/")} onCancel={() => setExitModalOpen(false)} />

      <ErrorModal isOpen={isErrorModalOpen} title={errorTitle} message={errorMessage} onClose={() => setErrorModalOpen(false)} />
    </div>
  );
};

export default SeatingScreen;
