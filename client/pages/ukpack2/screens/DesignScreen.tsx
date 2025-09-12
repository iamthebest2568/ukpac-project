import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../components/CustomizationScreen';
import ColorPalette from '../components/ColorPalette';
import CtaButton from '../components/CtaButton';

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
      footerContent={<div className="flex justify-end"><CtaButton text="ออกแบบเสร็จแล้ว" onClick={handleFinish} /></div>}
    >
      <div className="space-y-6">
        <div className="w-full h-72 rounded-md flex items-center justify-center" style={{ backgroundColor: color }}>
          <div className="text-white font-prompt text-xl">Bus preview (color applied)</div>
        </div>

        <h2 className="text-xl font-prompt font-semibold">ออกแบบสี</h2>
        <ColorPalette colors={DEFAULT_COLORS} selectedColor={color} onColorSelect={setColor} />

        <h2 className="text-xl font-prompt font-semibold">ลักษณะพิเศษของรถคุณ</h2>
        <div>
          <input
            type="text"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            placeholder="พิมพ์คำขวัญของคุณที่นี่"
            className="w-full rounded-md px-4 py-2 bg-transparent border border-[#07204a] text-white placeholder-gray-300"
          />
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default DesignScreen;
