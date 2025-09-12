import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../components/CustomizationScreen';
import SecondaryButton from '../components/SecondaryButton';
import CtaButton from '../components/CtaButton';

const IconName = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19 19 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12 1.05.47 2.07 1.03 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FormScreen: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const submit = () => {
    try {
      sessionStorage.setItem('design.entry', JSON.stringify({ name, phone }));
    } catch (e) {}
    navigate('/ukpack2/confirmation');
  };

  const skip = () => {
    navigate('/ukpack2/end');
  };

  return (
    <CustomizationScreen
      title="รถเมล์ในฝัน"
      footerContent={<div className="flex justify-end gap-3"><SecondaryButton text="ลุ้นรับรางวัล" onClick={submit} /><CtaButton text="ไม่ลุ้นรับรางวัล" onClick={skip} /></div>}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-md">
            <IconName />
          </div>
          <input className="flex-1 rounded-md px-3 py-2 bg-transparent border border-[#07204a] text-white" placeholder="ชื่อ-นามสกุล" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-md">
            <IconPhone />
          </div>
          <input className="flex-1 rounded-md px-3 py-2 bg-transparent border border-[#07204a] text-white" placeholder="เบอร์โทร" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default FormScreen;
