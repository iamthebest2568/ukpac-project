import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CtaButton from '../components/CtaButton';
import FeedbackChoiceModal from '../components/FeedbackChoiceModal';
import InfoBubbleCard from '../components/InfoBubbleCard';

const SummaryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [designData, setDesignData] = useState<Record<string, any>>({});
  const [showModal, setShowModal] = useState(false);

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
    <div className="min-h-screen bg-white text-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-prompt font-semibold">เสร็จแล้ว!</h1>
          <p className="mt-2 text-sm text-gray-600">นี่คือรถเมล์ในฝันของคุณ</p>
        </header>

        {heroImg && (
          <div className="flex flex-col items-center mb-6">
            <img src={heroImg} alt={`ภาพรถ - ${chassisLabel}`} className="h-64 w-auto object-contain select-none" decoding="async" loading="eager" />
            <p className="mt-2 font-prompt font-semibold text-[#001a73] text-center">รถที่เลือก : {chassisLabel}</p>
          </div>
        )}

        <InfoBubbleCard>
          <h3 className="text-lg font-prompt font-semibold">รู้หรือไม่!</h3>
          <div className="mt-2 text-sm text-[#001a73] prose">
            <p>
              ระบบรถเมล์ชุมชนเป็นรูปแบบบริการขนส่��ที่เน้นการเชื่อมต่อผู้คนในชุมชน โดยมีเส้นทางที่ยืดหยุ่นและสามารถปรับให้เข้ากับความต้องการของผู้ใช้
              บริการนี้ส่งเสริมการเข้าถึง การเดินทางที่ปลอดภัยและสะดวกสบายสำหรับทุกคน รวมถึงผู้สูงอายุและผู้พิการ
              ผู้ใช้สามารถเลือกรูปแบบการชำระเงินและสิ่งอำนวยความสะดวกที่ต้องการ เพื่อให้รถเมล์ตอบโจทย์การใช้งานของชุมชนได้ดีที่สุด.
            </p>
            <p>(เนื้อหาเพิ่มเติมสามารถปรับจาก CMS ภายหลัง)</p>
          </div>
        </InfoBubbleCard>

        <footer className="mt-6">
          <div className="bg-[#00d5f9] rounded-t-3xl p-6 drop-shadow-lg mt-8">
            <div className="max-w-4xl mx-auto flex items-center justify-center">
              <CtaButton text="ไปต่อ" onClick={() => setShowModal(true)} />
            </div>
          </div>
        </footer>
      </div>

      <FeedbackChoiceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onChooseUse={() => navigate('/ukpack2/feedback')}
        onChooseNotSure={() => navigate('/ukpack2/thank-you')}
      />
    </div>
  );
};

export default SummaryScreen;
