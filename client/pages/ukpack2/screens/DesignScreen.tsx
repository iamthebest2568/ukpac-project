import React, { useState } from 'react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../components/CustomizationScreen';
import ColorPalette from '../components/ColorPalette';
import CtaButton from '../components/CtaButton';
import StepTabs from "../components/StepTabs";

const DEFAULT_COLORS = [
  '#000d59', // primary dark blue
  '#ffffff', // white
  '#00d5f9', // accent cyan
  '#ffe000', // accent yellow
  '#0a1b3a',
  '#07204a',
  '#1b3b6f',
  '#2b6f8f',
  '#ffb400',
  '#ffd874',
  '#e6f9ff',
  '#dbeafe',
];

const DesignScreen: React.FC = () => {
  const navigate = useNavigate();
  const [color, setColor] = useState<string>(DEFAULT_COLORS[0]);
  const [slogan, setSlogan] = useState<string>('');

  const handleFinish = () => {
    try {
      sessionStorage.setItem('design.color', color);
      sessionStorage.setItem('design.slogan', slogan);
    } catch (e) {}
    navigate('/ukpack2/summary');
  };

  return (
    <CustomizationScreen
      title="ปรับแต่งรถเมล์ของคุณ"
      theme="light"
      footerContent={<div className="flex justify-center"><CtaButton text="ออกแบบเสร็จแล้ว" onClick={handleFinish} /></div>}
    >
      <div className="space-y-6">
        <div className="w-full rounded-md flex flex-col items-center justify-center gap-2">
          {(() => {
            const CHASSIS_LABELS: Record<string, string> = {
              small: 'รถเมล์ข���าดเล็ก 16–30 ที่นั่ง',
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
            let selected = 'medium';
            try {
              const saved = sessionStorage.getItem('design.chassis');
              if (saved) selected = saved;
            } catch (e) {}
            const label = CHASSIS_LABELS[selected] || '';
            const img = HERO_IMAGE[selected];
            return img ? (
              <>
                <img src={img} alt={`ภาพรถ - ${label}`} className="h-72 w-auto object-contain select-none" decoding="async" loading="eager" />
                <p className="mt-1 font-prompt font-semibold text-[#001a73] text-center">รถที่ใช้งาน : {label}</p>
              </>
            ) : (
              <div className="w-full h-72 rounded-md flex items-center justify-center text-sm text-gray-300">Bus preview (color applied)</div>
            );
          })()}
        </div>
        <div className="bg-white rounded-t-3xl -mt-2 p-4">
          <StepTabs active={0} />

          <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">ออกแบบสี</h2>
          <ColorPalette colors={DEFAULT_COLORS} selectedColor={color} onColorSelect={setColor} />

          <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">ลักษณะพิเศษอื่น ๆ ของรถคุณ</h2>
          <div>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="พิมพ์คำขวัญของคุณที่นี่"
              className="w-full rounded-md px-4 py-2 bg-white border border-[#e5e7eb] text-[#003366] placeholder-gray-400"
            />
          </div>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default DesignScreen;
