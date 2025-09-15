import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../components/CustomizationScreen';
import CtaButton from '../components/CtaButton';
import SecondaryButton from '../components/SecondaryButton';

const FeedbackSkipScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleEnd = () => {
    navigate('/ukpack2/end');
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'ลองออกแบบรถเมล์กับฉัน',
        text: 'ผม/ฉันได้ออกแบบรถเมล์ในฝัน ลองดูสิ',
        url: window.location.origin + '/ukpack2',
      };
      if ((navigator as any).share) {
        await (navigator as any).share(shareData);
      } else {
        // fallback: copy url to clipboard
        await navigator.clipboard.writeText(shareData.url);
        alert('ลิงก์ถูกคัดลอกไปยังคลิปบอร์ดแล้ว');
      }
    } catch (e) {
      console.log('share failed', e);
    }
  };

  return (
    <CustomizationScreen title="ขอบคุณ" theme="light" footerContent={
      <div className="flex justify-center gap-3">
        <SecondaryButton text="แชร์เกมนี้ให้เพื่อน" onClick={handleShare} />
        <CtaButton text="จบเกม" onClick={handleEnd} />
      </div>
    }>
      <div className="py-6 px-4">
        <h2 className="text-xl font-prompt font-semibold text-[#001a73]">ขอบคุณสำหรับความคิดเห็นของคุณ</h2>
        <p className="mt-3 text-sm text-gray-700">คุณสามารถแชร์เกมนี้กับเพื่อนหรือจบเกมได้ตามต้องการ</p>
      </div>
    </CustomizationScreen>
  );
};

export default FeedbackSkipScreen;
