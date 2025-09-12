import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../components/CustomizationScreen';
import CtaButton from '../components/CtaButton';

const SubmitScreen: React.FC = () => {
  const navigate = useNavigate();
  const [interval, setInterval] = useState('');
  const [route, setRoute] = useState('');
  const [area, setArea] = useState('');

  const handleFinish = () => {
    try {
      const submitData = { interval, route, area };
      sessionStorage.setItem('design.submit', JSON.stringify(submitData));
    } catch (e) {}
    navigate('/ukpack2/thank-you');
  };

  return (
    <CustomizationScreen
      title="การบริการของรถเมล์"
      footerContent={<div className="flex justify-end"><CtaButton text="ออกแบบเสร็จแล้ว" onClick={handleFinish} /></div>}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-white font-sarabun mb-2">รถจะมาทุกๆ</label>
          <input type="text" value={interval} onChange={(e) => setInterval(e.target.value)} className="w-full rounded-md px-3 py-2 bg-transparent border border-[#07204a] text-white" />
        </div>

        <div>
          <label className="block text-white font-sarabun mb-2">สายรถเมล์</label>
          <input type="text" value={route} onChange={(e) => setRoute(e.target.value)} className="w-full rounded-md px-3 py-2 bg-transparent border border-[#07204a] text-white" />
        </div>

        <div>
          <label className="block text-white font-sarabun mb-2">พื้นที่ที่วิ่ง</label>
          <input type="text" value={area} onChange={(e) => setArea(e.target.value)} className="w-full rounded-md px-3 py-2 bg-transparent border border-[#07204a] text-white" />
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default SubmitScreen;
