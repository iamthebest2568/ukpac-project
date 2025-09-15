import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../components/CustomizationScreen';
import SecondaryButton from '../components/SecondaryButton';
import CtaButton from '../components/CtaButton';

const ThankYouScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CustomizationScreen
      title="ขอบคุณ"
      footerContent={
        <div className="flex justify-end gap-3">
          <SecondaryButton text="ลุ้นรับรางวัล" onClick={() => navigate('/ukpack2/form')} />
          <CtaButton text="ไม่ลุ้นรับรางวัล" onClick={() => navigate('/ukpack2/feedback-skip')} />
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-xl font-prompt font-semibold text-[#ffe000]">ที่ร่วมสร้างสรรค์รถเมล์</h2>
        <p className="font-sarabun text-white">
          ขอบคุณสำหรับการออกแบบรถเมล์ของคุณ! ตอนนี้คุณมีโอกาสเข้าร่วมลุ้นรางวัล มูลค่า 300 บาท โดยการลงทะเบียนข้อมูลการติดต่อของคุณ
          หรือข้ามการลุ้นรับรางวัลได้ทันที
        </p>
      </div>
    </CustomizationScreen>
  );
};

export default ThankYouScreen;
