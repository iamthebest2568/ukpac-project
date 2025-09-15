import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../components/CustomizationScreen';
import ColorPalette from '../components/ColorPalette';
import CtaButton from '../components/CtaButton';
import StepTabs from "../components/StepTabs";

const DEFAULT_COLORS = [
  'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5456dc0212c14ba6a327d537ceed405e?format=webp&width=800', // c1
  'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F60613c947767482aa9d75e7414cdf10a?format=webp&width=800', // c2
  'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F257808683b104f7fb4c3d4ba712b4ef0?format=webp&width=800', // c3
  'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc1540ee8e580442bbcfe1c7cbf7ca0ca?format=webp&width=800', // c4
  'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F31b9a82b697a46a6b5b14e32002472d8?format=webp&width=800', // c5
  'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcae7472130bc47f09f28af725a944548?format=webp&width=800', // c6
  'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F117b0cdb42744374a5999f03625d56aa?format=webp&width=800', // c7
  'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fee9ba92b67734653865abb9c651119d6?format=webp&width=800', // c8
  'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ffae13b859b7c45eba3e49272be7622d2?format=webp&width=800', // c9
  'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9ba49f215d7d4abca6a601bdee2d7bd5?format=webp&width=800', // c10
  'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F30bc6908a9fc4a9e96afd58e5885af1b?format=webp&width=800', // c11
  'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F321fa0e9571a4e34b5fe6beffc1fbbed?format=webp&width=800', // c12
];

const DesignScreen: React.FC = () => {
  const navigate = useNavigate();
  const [color, setColor] = useState<string>(DEFAULT_COLORS[0]);
  const [slogan, setSlogan] = useState<string>('');
  const [showTextarea, setShowTextarea] = useState<boolean>(false);
  const [sloganDraft, setSloganDraft] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (showTextarea) {
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [showTextarea]);

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

          <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">ลักษณะพิเศษ��ื่น ๆ ของรถคุณ</h2>
          <div>
            <input
              type="text"
              value={slogan}
              readOnly
              onClick={() => { setSloganDraft(slogan); setShowTextarea(true); }}
              placeholder="พิมพ์ คุณสมบัติพิเศษ"
              className="w-full rounded-md px-4 py-2 bg-white border border-[#e5e7eb] text-[#003366] placeholder-gray-400 cursor-text"
            />

            {showTextarea && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-lg p-4 max-w-lg w-full mx-4">
                  <h3 className="text-lg font-prompt font-semibold text-[#000d59]">ลักษณะพิเศษอื่นๆ</h3>
                  <textarea
                    ref={textareaRef}
                    value={sloganDraft}
                    onChange={(e) => setSloganDraft(e.target.value)}
                    placeholder="พิมพ์คุณสมบัติพิเศษอื่นๆ ของรถเมล์ในฝันของคุณ"
                    className="mt-3 w-full h-36 p-3 border rounded-md text-sm resize-none"
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => setShowTextarea(false)}
                      className="px-4 py-2 rounded-md bg-gray-200"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={() => { setSlogan(sloganDraft); setShowTextarea(false); }}
                      className="px-4 py-2 rounded-md bg-[#000d59] text-white"
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default DesignScreen;
