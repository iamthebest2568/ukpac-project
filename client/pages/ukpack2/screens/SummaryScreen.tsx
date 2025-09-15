import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import SecondaryButton from '../components/SecondaryButton';
import CtaButton from '../components/CtaButton';

const SummaryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [designData, setDesignData] = useState<Record<string, any>>({});

  useEffect(() => {
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
      if (seating) data.seating = JSON.parse(seating);
      if (amenities) data.amenities = JSON.parse(amenities);
      if (payment) data.payment = JSON.parse(payment);
      if (doors) data.doors = JSON.parse(doors);
      if (color) data.color = color;
      if (slogan) data.slogan = slogan;
    } catch (e) {}
    setDesignData(data);
  }, []);

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

  const selected = (() => {
    try {
      return (designData.chassis as string) || sessionStorage.getItem('design.chassis') || 'medium';
    } catch (e) {
      return 'medium';
    }
  })();

  const chassisLabel = CHASSIS_LABELS[selected] || '';
  const heroImg = HERO_IMAGE[selected];

  return (
    <div className="min-h-screen bg-[#000d59] text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-prompt font-semibold">เสร็จแล้ว!</h1>
          <p className="mt-2 text-sm text-white/80">นี่คือรถเมล์ในฝันของคุณ</p>
        </header>

        <div className="w-full h-64 rounded-md mb-6 flex items-center justify-center">
          {heroImg ? (
            <div className="flex flex-col items-center">
              <img src={heroImg} alt={`ภาพรถ - ${chassisLabel}`} className="h-64 w-auto object-contain select-none" decoding="async" loading="eager" />
              <p className="mt-2 font-prompt font-semibold text-[#001a73] text-center">รถที่เลือก : {chassisLabel}</p>
            </div>
          ) : (
            <div className="w-full h-64 rounded-md mb-6 flex items-center justify-center" style={{ backgroundColor: designData.color || '#081042' }}>
              <div className="text-white">Final bus preview</div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-4 text-sm text-gray-800 shadow-sm">
          <div className="grid gap-4">
            <div>
              <div className="text-xs text-gray-500">รูปแบบรถ</div>
              <div className="font-sarabun font-semibold text-sm">{chassisLabel}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">ที่นั่ง</div>
              <div className="font-sarabun font-semibold text-sm">{designData.seating ? (typeof designData.seating === 'object' ? designData.seating.totalSeats : String(designData.seating)) : '-'}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">การจ่ายเงิน</div>
              <div className="font-sarabun font-semibold text-sm">{designData.payment ? (Array.isArray(designData.payment) ? designData.payment.join(', ') : String(designData.payment)) : '-'}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">ความสะดวก</div>
              <div className="font-sarabun font-semibold text-sm">{designData.amenities ? (Array.isArray(designData.amenities) ? designData.amenities.join(', ') : String(designData.amenities)) : '-'}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">ทางขึ้น</div>
              <div className="font-sarabun font-semibold text-sm">{designData.doors ? (typeof designData.doors === 'string' ? displayDoor(designData.doors) : String(designData.doors)) : '-'}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">ลักษณะพิเศษ</div>
              <div className="font-sarabun font-semibold text-sm">{designData.slogan || designData.exterior?.customText || '-'}</div>
            </div>
          </div>
        </div>

        <footer className="mt-6">
          <div className="bg-[#00d5f9] rounded-t-3xl p-6 drop-shadow-lg mt-8">
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
                <SecondaryButton text="กลับไปแก้ไข" onClick={() => navigate('/ukpack2/design')} />
                <CtaButton text="ออกแบบเสร็จแล้ว" onClick={() => navigate('/ukpack2/info')} />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SummaryScreen;
