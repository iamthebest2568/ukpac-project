import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../../ukpack2/components/CustomizationScreen';
import SummaryCard from '../components/SummaryCard';
import SecondaryButton from '../../ukpack2/components/SecondaryButton';
import CtaButton from '../../ukpack2/components/CtaButton';

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

  return (
    <div className="min-h-screen bg-[#000d59] text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-prompt font-semibold">เสร็จแล้ว!</h1>
          <p className="mt-2 text-sm text-white/80">นี่คือรถเมล์ในฝันของคุณ</p>
        </header>

        <div className="w-full h-64 rounded-md mb-6 flex items-center justify-center" style={{ backgroundColor: designData.color || '#081042' }}>
          <div className="text-white">Final bus preview</div>
        </div>

        <SummaryCard designData={designData} />

        <footer className="mt-6">
          <div className="bg-[#00d5f9] rounded-t-3xl p-6 drop-shadow-lg mt-8">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="text-[#000d59] font-sarabun">ถ้ามีรถประจำทางแบบนี้คุณคิดว่าจะใช้บริการหรือไม่</div>
              <div className="flex items-center gap-3">
                <SecondaryButton text="ใช้บริการแน่นอน" onClick={() => navigate('/ukpack2/submit')} />
                <CtaButton text="ไม่แน่ใจ" onClick={() => navigate('/ukpack2/feedback')} />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SummaryScreen;
