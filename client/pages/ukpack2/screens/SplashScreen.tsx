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
            {/* Inline illustrative SVG of a bus in a city scene */}
            <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bus illustration">
              <defs>
                <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#071034" />
                </linearGradient>
                <linearGradient id="glass" x1="0" x2="1">
                  <stop offset="0%" stopColor="#bfeefd" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#a0e7ff" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              <rect x="0" y="0" width="800" height="400" fill="url(#sky)" />

              {/* skyline */}
              <g transform="translate(40,40)" fill="#07204a">
                <rect x="0" y="80" width="60" height="120" rx="4" />
                <rect x="80" y="40" width="80" height="160" rx="4" />
                <rect x="180" y="20" width="120" height="180" rx="4" />
                <rect x="320" y="60" width="90" height="140" rx="4" />
                <rect x="430" y="40" width="140" height="160" rx="4" />
                <rect x="590" y="80" width="80" height="120" rx="4" />
              </g>

              {/* road */}
              <rect x="0" y="300" width="800" height="100" fill="#071a2b" />
              <rect x="0" y="318" width="800" height="6" fill="#0b2236" />

              {/* bus */}
              <g transform="translate(90,220)">
                <rect x="0" y="-80" width="620" height="80" rx="12" fill="#00d5f9" />
                <rect x="16" y="-72" width="220" height="56" rx="8" fill="#001533" />
                <rect x="248" y="-72" width="356" height="56" rx="8" fill="#07204a" />
                <circle cx="80" cy="0" r="28" fill="#0a1b3a" />
                <circle cx="540" cy="0" r="28" fill="#0a1b3a" />
                <rect x="32" y="-56" width="80" height="36" rx="4" fill="url(#glass)" />
                <rect x="120" y="-56" width="80" height="36" rx="4" fill="url(#glass)" />
                <rect x="208" y="-56" width="80" height="36" rx="4" fill="url(#glass)" />
                <rect x="296" y="-56" width="100" height="36" rx="4" fill="url(#glass)" />
                <rect x="406" y="-56" width="80" height="36" rx="4" fill="url(#glass)" />
                <rect x="494" y="-56" width="80" height="36" rx="4" fill="url(#glass)" />

                <text x="310" y="-20" textAnchor="middle" fill="#ffffff" fontSize="18" fontFamily="Prompt, Arial, sans-serif" fontWeight="700">รถเมล์ในฝัน</text>
              </g>
            </svg>
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
