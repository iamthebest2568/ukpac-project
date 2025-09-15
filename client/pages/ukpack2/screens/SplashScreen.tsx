import React from 'react';
import { useNavigate } from 'react-router-dom';
import CtaButton from '../components/CtaButton';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000d59' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
        <div className="max-w-3xl w-full text-center">
          <div className="w-full h-64 md:h-80 flex items-center justify-center">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9bc10bbe8a7e462ca65ab61b4606bd64?format=webp&width=800" alt="รถเมล์ในฝัน" className="max-h-72 w-auto mx-auto object-contain" />
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-prompt font-bold text-white">รถเมล์ในฝัน</h1>
          <p className="mt-2 text-lg text-[#cfeeff]">โดย กรุงเทพเคลื่อนที่ได้</p>
        </div>
      </div>

      <div className="w-full" style={{ backgroundColor: '#00d5f9', borderTopLeftRadius: '48% 12%', borderTopRightRadius: '48% 12%' }}>
        <div className="max-w-3xl mx-auto py-8 px-6 text-center">
          <p className="text-[#002038] text-lg mb-6">รถเมล์ในฝันที่คุณอยากขึ้นทุกวัน จะมีหน้าตาอย่างไร?</p>
          <div className="flex justify-center">
            <CtaButton text="เริ่มออกแบบ" onClick={() => navigate('/ukpack2/chassis')} />
          </div>
          <div className="mt-6 text-sm text-[#07204a]">
            <a href="#" className="underline">นโยบายและความเป็นส่วนตัว</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
