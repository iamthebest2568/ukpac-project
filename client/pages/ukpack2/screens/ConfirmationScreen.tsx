import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../components/CustomizationScreen';
import SecondaryButton from '../components/SecondaryButton';
import CtaButton from '../components/CtaButton';

const ConfirmationScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CustomizationScreen
      title="ขอบคุณ"
      footerContent={<div className="flex justify-center"><CtaButton text="จบเกม" onClick={() => navigate('/ukpack2')} /><SecondaryButton text="แชร์เกมนี้กับเพื่อน" onClick={() => console.log('share')} /></div>}
    >
      <div className="space-y-4">
        <div className="bg-[#ffe000] text-[#000d59] rounded-md p-4">
          <p className="font-prompt font-semibold">คุณได้ลงทะเบียนเพื่อเข้าร่วมลุ้นรางวัล 300 บาทแล้ว</p>
          <p className="font-sarabun">ประกาศผลและการติดต่อจะส่งทางเบอร์โทรที่ให้ไว้ หากมีคำถาม สามารถติดต่อทีมงานได้</p>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default ConfirmationScreen;
