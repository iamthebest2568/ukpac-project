/*
 * UK PACK - End Sequence Step 2: Reward Form
 * Standardized layout (flow-based, no absolute positioning)
 */

import { useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout";

interface Step2_FormProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
}

const Step2_Form = ({ sessionID, onNext, onBack, initialData }: Step2_FormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "กรุณากรอกชื่อ";
    if (!formData.phone.trim()) newErrors.phone = "กรุณากรอกเบอร์โทร";
    else if (!/^[0-9]{9,10}$/.test(formData.phone.replace(/[-\s]/g, ""))) newErrors.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleNext = () => {
    if (validateForm()) {
      logEvent({ event: "REWARD_FORM_SUBMIT", payload: { data: formData, sessionID } });
      try {
        const body = {
          sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
          event: "ENDSEQ_CONTACT",
          payload: { name: formData.name, phone: formData.phone },
        };
        navigator.sendBeacon?.(
          "/api/track",
          new Blob([JSON.stringify(body)], { type: "application/json" }),
        ) ||
          fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
      } catch {}

      onNext({ rewardForm: formData });
    }
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Feb2f14480a1349a6bc6b76594e26c7b5?format=webp&width=2160"
      backgroundAlt="กรอกข้อมูลรับรางวัล"
      className="source-selection-page endseq-form-page"
      imageLoading="eager"
    >
      <div className="w-full max-w-[980px] mx-auto px-4 py-6">
        <h1 className="font-prompt text-center" style={{ color: '#000D59', fontSize: 'clamp(24px, 5.6vw, 60px)', fontWeight: 700 }}>
          กรอกข้อมูล เพื่อรับรางวัล
        </h1>

        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="w-full max-w-[890px]">
            <label className="sr-only" htmlFor="name">ชื่อ-นามสกุล</label>
            <div className="bg-white border-[5px] rounded-[20px] flex items-center" style={{ borderColor: errors.name ? '#ef4444' : '#000D59', height: 'clamp(60px, 5.9vw, 114px)' }}>
              <div style={{ width: 'clamp(60px, 5.6vw, 108px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="https://api.builder.io/api/v1/image/assets/TEMP/43c5afa8ad1bbf3282039603c53e3f49565612bc?width=120" alt="" style={{ width: 'clamp(30px,2.8vw,60px)', height: 'clamp(32px,2.9vw,63px)' }} />
              </div>
              <div style={{ width: '5px', height: 'clamp(41px,3.8vw,82px)', background: '#000D59', margin: '0 clamp(10px,1vw,20px)' }} />
              <input id="name" type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="ชื่อ-นามสกุล" className="flex-1 bg-transparent border-none outline-none font-prompt" style={{ fontSize: 'clamp(16px,3.7vw,40px)', paddingRight: 'clamp(10px,1vw,20px)' }} />
            </div>
            {errors.name && <div className="text-red-400 text-sm mt-2">{errors.name}</div>}
          </div>

          <div className="w-full max-w-[890px]">
            <label className="sr-only" htmlFor="phone">เบอร์โทรศัพท์</label>
            <div className="bg-white border-[5px] rounded-[20px] flex items-center" style={{ borderColor: errors.phone ? '#ef4444' : '#000D59', height: 'clamp(60px, 5.9vw, 114px)' }}>
              <div style={{ width: 'clamp(60px, 5.6vw, 108px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="https://api.builder.io/api/v1/image/assets/TEMP/3350235bd026037b65d1706334d2624c4ede799b?width=78" alt="" style={{ width: 'clamp(20px,1.8vw,39px)', height: 'clamp(35px,3.2vw,69px)' }} />
              </div>
              <div style={{ width: '5px', height: 'clamp(41px,3.8vw,82px)', background: '#000D59', margin: '0 clamp(10px,1vw,20px)' }} />
              <input id="phone" type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="เบอร์โทรศัพท์" className="flex-1 bg-transparent border-none outline-none font-prompt" style={{ fontSize: 'clamp(16px,3.7vw,40px)', paddingRight: 'clamp(10px,1vw,20px)' }} />
            </div>
            {errors.phone && <div className="text-red-400 text-sm mt-2">{errors.phone}</div>}
          </div>

        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button onClick={handleNext} className="btn-large">ลุ้นรับรางวัล</button>
          <button onClick={onBack} className="btn-large">ไม่</button>
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step2_Form;
