import React from "react";
import VehiclePreview from "./VehiclePreview";

const IconAir = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fee1c18a935564e92bb49991fac3b76df?format=webp&width=800"
    alt="แอร์"
    className="h-6 w-6 object-contain select-none"
  />
);
const IconFan = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe01792ee89e240808ed47d8576b55d71?format=webp&width=800"
    alt="พัดลม"
    className="h-6 w-6 object-contain select-none"
  />
);
const IconSeat = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F93439b2533284cdf914fc93cafa1cf26?format=webp&width=800"
    alt="ที่นั่งพิเศษ"
    className="h-6 w-6 object-contain select-none"
  />
);
const IconWifi = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb0789bfd1100472f8351704764607d31?format=webp&width=800"
    alt="ที่จับ/���าวยืน"
    className="h-6 w-6 object-contain select-none"
  />
);
const IconPlug = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F09a78e31a3de44e98772b0eef382af6f?format=webp&width=800"
    alt="ช่องชาร์จมือถือ/USB"
    className="h-6 w-6 object-contain select-none"
  />
);
const IconTv = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcb0cbf9ef6764e2d9e6f06e87827f5e9?format=webp&width=800"
    alt="Wi‑Fi ฟรี"
    className="h-6 w-6 object-contain select-none"
  />
);
const IconCup = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe903bdf27bab4175824c159bc19a02ba?format=webp&width=800"
    alt="ระบบประกาศ"
    className="h-6 w-6 object-contain select-none"
  />
);
const IconCamSmall = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="7"
      width="14"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M19 8l2-2v10l-2-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Payment icons with updated assets
const MONEY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9349b93d24274adc91be5f4657facdda?format=webp&width=800";
const SCAN_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbc97b87e6027435fb25a72f5478406cd?format=webp&width=800";
const SCAN2_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F56620e798eb94153b2390271f30d0dae?format=webp&width=800";
const TOUCH_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4e22405c00c84fbfb1cd43fea6d8f8b4?format=webp&width=800";
const MONTHLY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff841cf7477174217b2aa753d7acb4b21?format=webp&width=800";
const BUS_EMPLOY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F47fc617541cf45f28b7aa2d1b8deaf64?format=webp&width=800";

const AMENITIES_ICON_MAP: Record<string, JSX.Element> = {
  แอร์: <IconAir />,
  พัดลม: <IconFan />,
  ที่นั่งพิเศษ: <IconSeat />,
  "ที่จ��บ/ราวยืนที่ปลอดภัย": <IconWifi />,
  "ช่องชาร์จมือถือ/USB": <IconPlug />,
  "Wi‑Fi ฟรี": <IconTv />,
  "ระบบประกาศบอกป้าย(เสียง/จอ)": <IconCup />,
  กล้องวงจรปิด: <IconCamSmall />,
  // Payment icons
  เงินสด: (
    <img src={MONEY_ICON} alt="เงินสด" className="h-5 w-5 object-contain" />
  ),
  สแกนจ่าย: (
    <img src={SCAN_ICON} alt="สแกนจ่าย" className="h-5 w-5 object-contain" />
  ),
  "สแกนจ่าย 2": (
    <img src={SCAN2_ICON} alt="สแกนจ่าย 2" className="h-5 w-5 object-contain" />
  ),
  แตะบัตร: (
    <img src={TOUCH_ICON} alt="แตะบัตร" className="h-5 w-5 object-contain" />
  ),
  กระเป๋ารถเมล์: (
    <img
      src={BUS_EMPLOY_ICON}
      alt="กระเป๋ารถเมล์"
      className="h-5 w-5 object-contain"
    />
  ),
  "ตั๋วรายเดือน/รอบ": (
    <img
      src={MONTHLY_ICON}
      alt="ตั๋วรายเดือน/รอบ"
      className="h-5 w-5 object-contain"
    />
  ),
  // Door icons
  "1": (
    <img
      src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9811f9bca05c43feae9eafdcbab3c8d9?format=webp&width=800"
      alt="1 ประตู"
      className="h-5 w-5 object-contain"
    />
  ),
  "2": (
    <img
      src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8f9b21942af243b3b80b0e5ac8b12631?format=webp&width=800"
      alt="2 ประตู"
      className="h-5 w-5 object-contain"
    />
  ),
  ramp: (
    <img
      src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fece2b6fc843340f0997f2fd7d3ca0aea?format=webp&width=800"
      alt="��างลาด"
      className="h-5 w-5 object-contain"
    />
  ),
  emergency: (
    <img
      src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F98de0624be3d4ae6b96d83edcf8891f9?format=webp&width=800"
      alt="ประตูฉุกเฉิน"
      className="h-5 w-5 object-contain"
    />
  ),
};

const displayDoor = (raw: any) => {
  if (!raw) return "-";
  if (typeof raw === "string") {
    if (raw === "1") return "1 ประตู";
    if (raw === "2") return "2 ประตู";
    if (raw === "ramp") return "ทางลาดสำหรับรถเข็น/ผู้พิการ";
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
  medium: "รถเมล์มาตรฐาน 30–50 ที่นั่ง",
  large: "รถตู้โดยสาร 9–15 ที่นั่ง",
  extra: "รถกะบะดัดแปลง 8–12 ที่นั่ง",
};

const HERO_IMAGE: Record<string, string> = {
  small:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5ea1b3d990e44d49aa5441bc3a4b3bcc?format=webp&width=800",
  medium:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fab8ddd78f9a0478bb27f5818928665f3?format=webp&width=800",
  large:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc4ba360c1fe64492b71fc207c9dfd328?format=webp&width=800",
  extra:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9a8a7536ced24db19a65409fbba1c6b6?format=webp&width=800",
};

const storedColor = (() => {
  try {
    const raw = sessionStorage.getItem('design.color');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

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
          <VehiclePreview
            imageSrc={heroImg}
            colorFilter={storedColor?.filter}
            label={`รถที่เลือก : ${chassisLabel}`}
            overlayLabels={(() => {
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
              const doorsRaw = (() => {
                try {
                  const raw = sessionStorage.getItem("design.doors");
                  return raw
                    ? (JSON.parse(raw) as any)
                    : raw
                      ? String(raw)
                      : null;
                } catch {
                  return sessionStorage.getItem("design.doors");
                }
              })();
              const overlayLabels: string[] = [
                ...(amenities || []),
                ...(payments || []),
              ];
              if (doorsRaw)
                overlayLabels.push(
                  typeof doorsRaw === "string"
                    ? doorsRaw
                    : doorsRaw.doorChoice ||
                        (doorsRaw.hasRamp
                          ? "ramp"
                          : doorsRaw.highLow
                            ? "emergency"
                            : ""),
                );
              return overlayLabels;
            })()}
            overlayIconMap={AMENITIES_ICON_MAP}
          />
        </div>
      )}

      <div className="bg-[#e6e7e8] rounded-lg p-4 text-sm text-gray-800 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-28 md:w-36 text-sm text-[#003366] truncate">
              รูปแบบรถ
            </div>
            <div className="flex-1 font-sarabun font-semibold text-sm text-[#003366] break-words">
              {chassisLabel}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-28 md:w-36 text-sm text-[#003366] truncate">
              ที่นั่ง
            </div>
            <div className="flex-1 font-sarabun font-semibold text-sm text-[#003366] break-words">
              {data.seating
                ? typeof data.seating === "object"
                  ? data.seating.totalSeats
                  : String(data.seating)
                : "-"}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-28 md:w-36 text-sm text-[#003366] truncate">
              การจ่ายเงิน
            </div>
            <div className="flex-1 font-sarabun font-semibold text-sm text-[#003366] break-words">
              {data.payment
                ? Array.isArray(data.payment)
                  ? data.payment.join(", ")
                  : String(data.payment)
                : "-"}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-28 md:w-36 text-sm text-[#003366] truncate">
              ความสะดวก
            </div>
            <div className="flex-1 font-sarabun font-semibold text-sm text-[#003366] break-words">
              {data.amenities
                ? Array.isArray(data.amenities)
                  ? data.amenities.join(", ")
                  : String(data.amenities)
                : "-"}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-28 md:w-36 text-sm text-[#003366] truncate">
              ทางขึ้น
            </div>
            <div className="flex-1 font-sarabun font-semibold text-sm text-[#003366] break-words">
              {data.doors
                ? typeof data.doors === "string"
                  ? displayDoor(data.doors)
                  : typeof data.doors === "object"
                    ? data.doors.doorChoice
                      ? data.doors.doorChoice === "1"
                        ? "1 ประตู"
                        : data.doors.doorChoice === "2"
                          ? "2 ประตู"
                          : String(data.doors.doorChoice)
                      : data.doors.hasRamp
                        ? "ทางลาดสำหรับรถเข็น/ผู้พิการ"
                        : data.doors.highLow
                          ? "ประตูฉุกเฉิน"
                          : JSON.stringify(data.doors)
                    : String(data.doors)
                : "-"}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-28 md:w-36 text-sm text-[#003366] truncate">
              ลักษณะพิเศษ
            </div>
            <div className="flex-1 font-sarabun font-semibold text-sm text-[#003366] break-words">
              {data.slogan || "-"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryDetails;
