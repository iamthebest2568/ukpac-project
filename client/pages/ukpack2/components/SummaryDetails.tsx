import React from 'react';

const displayDoor = (raw: any) => {
  if (!raw) return '-';
  if (typeof raw === 'string') {
    if (raw === '1') return '1 ประตู';
    if (raw === '2') return '2 ประตู';
    if (raw === 'ramp') return 'ทางลาดสำหรับรถเข็น/ผู้พิการ';
    if (raw === 'emergency') return 'ประตูฉุกเฉิน';
    return raw;
  }
  if (typeof raw === 'object') {
    if (raw.doorChoice) return raw.doorChoice === '1' ? '1 ประตู' : raw.doorChoice === '2' ? '2 ประตู' : String(raw.doorChoice);
    if (raw.hasRamp) return 'ทางลาดสำหรับรถเข็น/ผู้พิการ';
    if (raw.highLow) return 'ประตูฉุกเฉิน';
  }
  return String(raw);
};

const CHASSIS_LABELS: Record<string, string> = {
  small: 'รถเมล์ขนาดเล็ก 16–30 ที่นั่ง',
  medium: 'รถเมล์ขนาดกลาง 31–40 ที่นั่ง',
  large: 'รถเมล์ขนาดใหญ่ 41-50 ที่นั่ง',
  extra: 'รถเมล์รุ่นพิเศษ 51+ ที่นั่ง',
};

const HERO_IMAGE: Record<string, string> = {
  small: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5ea1b3d990e44d49aa5441bc3a4b3bcc?format=webp&width=800',
  medium: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fab8ddd78f9a0478bb27f5818928665f3?format=webp&width=800',
  large: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fefc1e1ed3bcb4769b51d1544d43b3b5f?format=webp&width=800',
  extra: 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9a8a7536ced24db19a65409fbba1c6b6?format=webp&width=800',
};

const SummaryDetails: React.FC = () => {
  const data: Record<string, any> = {};
  try {
    const chassis = sessionStorage.getItem('design.chassis');
    const seating = sessionStorage.getItem('design.seating');
    const amenities = sessionStorage.getItem('design.amenities');
    const payment = sessionStorage.getItem('design.payment');
    const doors = sessionStorage.getItem('design.doors');
    const color = sessionStorage.getItem('design.color');
    const slogan = sessionStorage.getItem('design.slogan');

    if (chassis) data.chassis = chassis;
    if (seating) data.seating = seating ? JSON.parse(seating) : undefined;
    if (amenities) data.amenities = amenities ? JSON.parse(amenities) : undefined;
    if (payment) data.payment = payment ? JSON.parse(payment) : undefined;
    if (doors) data.doors = doors ? ( (() => { try { return JSON.parse(doors); } catch { return doors; } })() ) : undefined;
    if (color) data.color = color;
    if (slogan) data.slogan = slogan;
  } catch (e) {
    // ignore
  }

  const selected = (() => {
    try {
      return (data.chassis as string) || sessionStorage.getItem('design.chassis') || 'medium';
    } catch (e) {
      return 'medium';
    }
  })() as string;

  const chassisLabel = CHASSIS_LABELS[selected] || '';
  const heroImg = HERO_IMAGE[selected];

  return (
    <>
      {heroImg && (
        <div className="flex flex-col items-center mb-6">
          <img src={heroImg} alt={`ภาพรถ - ${chassisLabel}`} className="h-64 w-auto object-contain select-none" decoding="async" loading="eager" />
          <p className="mt-2 font-prompt font-semibold text-[#001a73] text-center">รถที่เลื���ก : {chassisLabel}</p>
        </div>
      )}

      <div className="bg-[#e6e7e8] rounded-lg p-4 text-sm text-gray-800 shadow-sm">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">รูปแบบรถ</div>
            <div className="font-sarabun font-semibold text-sm text-right ml-4">{chassisLabel}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">ที่นั่ง</div>
            <div className="font-sarabun font-semibold text-sm text-right ml-4">{data.seating ? (typeof data.seating === 'object' ? data.seating.totalSeats : String(data.seating)) : '-'}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">การจ่ายเงิน</div>
            <div className="font-sarabun font-semibold text-sm text-right ml-4">{data.payment ? (Array.isArray(data.payment) ? data.payment.join(', ') : String(data.payment)) : '-'}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">ความสะดวก</div>
            <div className="font-sarabun font-semibold text-sm text-right ml-4">{data.amenities ? (Array.isArray(data.amenities) ? data.amenities.join(', ') : String(data.amenities)) : '-'}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">ทางขึ้น</div>
            <div className="font-sarabun font-semibold text-sm text-right ml-4">{data.doors ? (typeof data.doors === 'string' ? displayDoor(data.doors) : (typeof data.doors === 'object' ? (data.doors.doorChoice ? (data.doors.doorChoice === '1' ? '1 ประตู' : data.doors.doorChoice === '2' ? '2 ประตู' : String(data.doors.doorChoice)) : (data.doors.hasRamp ? 'ทางลาดสำหรับรถเข็น/ผู้พิการ' : data.doors.highLow ? 'ประตูฉุกเฉิน' : JSON.stringify(data.doors))) : String(data.doors))) : '-'}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">ลักษณะพิเศษ</div>
            <div className="font-sarabun font-semibold text-sm text-right ml-4">{data.slogan || '-'} </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryDetails;
