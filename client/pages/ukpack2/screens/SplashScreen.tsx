import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CtaButton from '../components/CtaButton';
import PrivacyModal from '../components/PrivacyModal';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e9f9ff' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
        <div className="max-w-3xl w-full text-center">
          <div className="w-full h-64 md:h-80 flex items-center justify-center">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fd0f51cc217ab444f85054abef8272035?format=webp&width=800" alt="รถเมล์ในฝัน" className="max-h-72 w-auto mx-auto object-contain" />
          </div>

        </div>
      </div>

      <div className="w-full" style={{ backgroundColor: '#00d5f9', borderTopLeftRadius: '48% 12%', borderTopRightRadius: '48% 12%' }}>
        <div className="max-w-3xl mx-auto py-8 px-6 text-center">
          <p className="text-[#002038] text-lg mb-6 font-semibold">รถเมล์ในฝันที่คุณอยากขึ้นทุกวัน จะมีหน้าตาอย่างไร?</p>
          <div className="flex justify-center">
            <CtaButton text="เริ่มออกแบบ" onClick={() => navigate('/ukpack2/chassis')} />
          </div>
          <div className="mt-6 text-sm text-[#07204a]">
            <button type="button" onClick={() => setShowPrivacy(true)} className="underline">นโยบายแ��ะความเป็นส่วนตัว</button>
          </div>
        </div>
      </div>
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};

export default SplashScreen;
