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
        <div className="w-full h-72 rounded-md flex items-center justify-center" style={{ backgroundColor: color }}>
          <div className="text-white font-prompt text-xl">Bus preview (color applied)</div>
        </div>
        <div className="bg-white rounded-t-3xl -mt-2 p-4">
          <StepTabs active={0} />

          <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">ออกแบบสี</h2>
          <ColorPalette colors={DEFAULT_COLORS} selectedColor={color} onColorSelect={setColor} />

          <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">ลักษณะพิเศ��ของรถคุณ</h2>
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
