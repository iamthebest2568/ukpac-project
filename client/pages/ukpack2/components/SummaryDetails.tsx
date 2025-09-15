import React from "react";
import HeroWithShadow from "./HeroWithShadow";

const IconAir = () => <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fee1c18a935564e92bb49991fac3b76df?format=webp&width=800" alt="แอร์" className="h-6 w-6 object-contain select-none"/>;
const IconFan = () => <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe01792ee89e240808ed47d8576b55d71?format=webp&width=800" alt="พัดลม" className="h-6 w-6 object-contain select-none"/>;
const IconSeat = () => <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F93439b2533284cdf914fc93cafa1cf26?format=webp&width=800" alt="ที่นั่งพิเศษ" className="h-6 w-6 object-contain select-none"/>;
const IconWifi = () => <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb0789bfd1100472f8351704764607d31?format=webp&width=800" alt="ที่จับ/ราวยืน" className="h-6 w-6 object-contain select-none"/>;
const IconPlug = () => <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F09a78e31a3de44e98772b0eef382af6f?format=webp&width=800" alt="ช่องชาร์จมือถือ/USB" className="h-6 w-6 object-contain select-none"/>;
const IconTv = () => <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcb0cbf9ef6764e2d9e6f06e87827f5e9?format=webp&width=800" alt="Wi‑Fi ฟรี" className="h-6 w-6 object-contain select-none"/>;
const IconCup = () => <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe903bdf27bab4175824c159bc19a02ba?format=webp&width=800" alt="ระบบประกาศ" className="h-6 w-6 object-contain select-none"/>;
const IconCamSmall = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M19 8l2-2v10l-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const AMENITIES_ICON_MAP: Record<string, JSX.Element> = {
  "แอร์": <IconAir />,
  "พัดลม": <IconFan />,
  "ที่นั่งพิเศษ": <IconSeat />,
  "ที่จับ/ราวยืนที่ปลอดภัย": <IconWifi />,
  "ช่องชาร์จมือถือ/USB": <IconPlug />,
  "Wi‑Fi ฟรี": <IconTv />,
  "ระบบประกาศบอกป้าย(เสียง/จอ)": <IconCup />,
  "กล้องวงจรปิด": <IconCamSmall />,
};

const displayDoor = (raw: any) => {
  if (!raw) return "-";
  if (typeof raw === "string") {
    if (raw === "1") return "1 ประตู";
    if (raw === "2") return "2 ประตู";
    if (raw === "ramp") return "ทางลาดสำหรับร��เข็น/ผู้พิการ";
    if (raw === "emergency") return "ประตูฉุกเฉิน";
    return raw;
  }
  if (typeof raw === "object") {
    if (raw.doorChoice)
      return raw.doorChoice === "1"
        ? "1 ประตู"
        : raw.doorChoice === "2"
          ? "2 ประตู"
          : String(raw.doorChoice);
    if (raw.hasRamp) return "ทางลาดสำหรับรถเข็น/ผู้พิการ";
    if (raw.highLow) return "ประตูฉุกเฉิน";
  }
  return String(raw);
};

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

const SummaryDetails: React.FC = () => {
  const data: Record<string, any> = {};
  try {
    const chassis = sessionStorage.getItem("design.chassis");
    const seating = sessionStorage.getItem("design.seating");
    const amenities = sessionStorage.getItem("design.amenities");
    const payment = sessionStorage.getItem("design.payment");
    const doors = sessionStorage.getItem("design.doors");
    const color = sessionStorage.getItem("design.color");
    const slogan = sessionStorage.getItem("design.slogan");

    if (chassis) data.chassis = chassis;
    if (seating) data.seating = seating ? JSON.parse(seating) : undefined;
    if (amenities)
      data.amenities = amenities ? JSON.parse(amenities) : undefined;
    if (payment) data.payment = payment ? JSON.parse(payment) : undefined;
    if (doors)
      data.doors = doors
        ? (() => {
            try {
              return JSON.parse(doors);
            } catch {
              return doors;
            }
          })()
        : undefined;
    if (color) data.color = color;
    if (slogan) data.slogan = slogan;
  } catch (e) {
    // ignore
  }

  const selected = (() => {
    try {
      return (
        (data.chassis as string) ||
        sessionStorage.getItem("design.chassis") ||
        "medium"
      );
    } catch (e) {
      return "medium";
    }
  })() as string;

  const chassisLabel = CHASSIS_LABELS[selected] || "";
  const heroImg = HERO_IMAGE[selected];

  return (
    <>
      {heroImg && (
        <div className="flex flex-col items-center mb-6">
          <HeroWithShadow>
            <div className="relative">
              {(() => {
                const amenities = (() => { try { const raw = sessionStorage.getItem('design.amenities'); return raw ? JSON.parse(raw) as string[] : []; } catch { return [] as string[]; } })();
                const payments = (() => { try { const raw = sessionStorage.getItem('design.payment'); return raw ? JSON.parse(raw) as string[] : []; } catch { return [] as string[]; } })();
                const doorsRaw = (() => { try { const raw = sessionStorage.getItem('design.doors'); return raw ? (JSON.parse(raw) as any) : raw ? String(raw) : null; } catch { return sessionStorage.getItem('design.doors'); } })();
                const overlayLabels: string[] = [...(amenities||[]), ...(payments||[])];
                if (doorsRaw) overlayLabels.push(typeof doorsRaw === 'string' ? doorsRaw : doorsRaw.doorChoice || (doorsRaw.hasRamp ? 'ramp' : doorsRaw.highLow ? 'emergency' : ''));
                return overlayLabels.length > 0 ? (
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 flex flex-wrap justify-center gap-2 z-20 max-w-[80%]">
                    {overlayLabels.map((lab, i) => (
                      <div key={`${lab}-${i}`} className="bg-white/90 backdrop-blur rounded-full p-1 shadow-md h-8 w-8 flex items-center justify-center">
                        {AMENITIES_ICON_MAP[lab] || <div className="text-xs">{String(lab)}</div>}
                      </div>
                    ))}
                  </div>
                ) : null;
              })()}

              <img
                src={heroImg}
                alt={`ภาพรถ - ${chassisLabel}`}
                className="h-64 w-auto object-contain select-none"
                decoding="async"
                loading="eager"
              />
            </div>
          </HeroWithShadow>
          <p className="mt-2 font-prompt font-semibold text-sm text-[#003366] text-center">
            รถที่เลื��ก : {chassisLabel}
          </p>
        </div>
      )}

      <div className="bg-[#e6e7e8] rounded-lg p-4 text-sm text-gray-800 shadow-sm">
        <div className="flex flex-col gap-3">

          <div className="flex items-start gap-3">
            <div className="w-28 md:w-36 text-sm text-[#003366] truncate">รูปแบบรถ</div>
            <div className="flex-1 font-sarabun font-semibold text-sm text-[#003366] break-words">{chassisLabel}</div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-28 md:w-36 text-sm text-[#003366] truncate">ที่นั่ง</div>
            <div className="flex-1 font-sarabun font-semibold text-sm text-[#003366] break-words">{data.seating ? (typeof data.seating === 'object' ? data.seating.totalSeats : String(data.seating)) : '-'}</div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-28 md:w-36 text-sm text-[#003366] truncate">การจ่ายเงิน</div>
            <div className="flex-1 font-sarabun font-semibold text-sm text-[#003366] break-words">{data.payment ? (Array.isArray(data.payment) ? data.payment.join(', ') : String(data.payment)) : '-'}</div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-28 md:w-36 text-sm text-[#003366] truncate">ความสะดวก</div>
            <div className="flex-1 font-sarabun font-semibold text-sm text-[#003366] break-words">{data.amenities ? (Array.isArray(data.amenities) ? data.amenities.join(', ') : String(data.amenities)) : '-'}</div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-28 md:w-36 text-sm text-[#003366] truncate">ทางขึ้น</div>
            <div className="flex-1 font-sarabun font-semibold text-sm text-[#003366] break-words">{data.doors ? (typeof data.doors === 'string' ? displayDoor(data.doors) : (typeof data.doors === 'object' ? (data.doors.doorChoice ? (data.doors.doorChoice === '1' ? '1 ประตู' : data.doors.doorChoice === '2' ? '2 ประตู' : String(data.doors.doorChoice)) : (data.doors.hasRamp ? 'ทางลาดสำหรับรถเข็น/ผู้พิการ' : data.doors.highLow ? 'ประตูฉุกเฉิน' : JSON.stringify(data.doors))) : String(data.doors))) : '-'}</div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-28 md:w-36 text-sm text-[#003366] truncate">ลักษณะพิเศษ</div>
            <div className="flex-1 font-sarabun font-semibold text-sm text-[#003366] break-words">{data.slogan || '-'}</div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SummaryDetails;
