/**
 * UK PACK - End Sequence Step 2: Reward Form
 * Moved from RewardForm component
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

const Step2_Form = ({
  sessionID,
  onNext,
  onBack,
  initialData,
}: Step2_FormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อ";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "กรุณากรอกเบอร์โทร";
    } else if (!/^[0-9]{9,10}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      // Log the reward form submission
      logEvent({
        event: "REWARD_FORM_SUBMIT",
        payload: {
          data: formData,
          sessionID,
        },
      });
      // Track to server (PII)
      try {
        const body = {
          sessionId:
            sessionID || sessionStorage.getItem("ukPackSessionID") || "",
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

      // Navigate to final thank you
      const data = { rewardForm: formData };
      onNext(data);
    }
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Feb2f14480a1349a6bc6b76594e26c7b5?format=webp&width=2160"
      backgroundAlt="กรอกข้อมูลรับรางวัล"
      className="source-selection-page endseq-form-page"
      imageLoading="eager"
    >
      {/* Title positioned as in Figma */}
      <div className="absolute w-full text-center" style={{ top: '59.7%' }}>
        <h1
          className="font-prompt text-center leading-normal"
          style={{
            color: '#000D59',
            fontSize: 'clamp(24px, 5.6vw, 60px)',
            fontWeight: 700,
            lineHeight: 'normal'
          }}
        >
          กรอกข้อมูล เพื่อรับรางวัล
        </h1>
      </div>

      {/* Form inputs positioned as in Figma */}
      <div className="absolute w-full flex flex-col items-center" style={{ top: '64.5%' }}>
        <div className="flex flex-col" style={{ width: '82.4%', maxWidth: '890px', gap: 'clamp(20px, 1.56vw, 30px)', marginBottom: '2.5rem' }}>
          {/* Name Input with icon and divider */}
          <div className="relative">
            <div
              className="bg-white border-[5px] rounded-[20px] flex items-center"
              style={{
                borderColor: errors.name ? '#ef4444' : '#000D59',
                height: 'clamp(60px, 5.9vw, 114px)',
                width: '100%'
              }}
            >
              {/* Person Icon */}
              <div className="flex items-center justify-center" style={{ width: 'clamp(60px, 5.6vw, 108px)' }}>
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/43c5afa8ad1bbf3282039603c53e3f49565612bc?width=120"
                  alt=""
                  style={{
                    width: 'clamp(30px, 2.8vw, 60px)',
                    height: 'clamp(32px, 2.9vw, 63px)'
                  }}
                />
              </div>

              {/* Vertical Divider */}
              <div
                className="bg-[#000D59]"
                style={{
                  width: '5px',
                  height: 'clamp(41px, 3.8vw, 82px)',
                  margin: '0 clamp(10px, 1vw, 20px)'
                }}
              />

              {/* Input */}
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-prompt placeholder-gray-500"
                placeholder="ชื่อ-นามสกุล"
                style={{
                  fontSize: 'clamp(16px, 3.7vw, 40px)',
                  fontWeight: 300,
                  color: 'rgba(0, 0, 0, 0.7)',
                  paddingRight: 'clamp(10px, 1vw, 20px)'
                }}
              />
            </div>
            {errors.name && (
              <div className="text-red-400 text-sm mt-1 ml-2">
                {errors.name}
              </div>
            )}
          </div>

          {/* Phone Input with icon and divider */}
          <div className="relative">
            <div
              className="bg-white border-[5px] rounded-[20px] flex items-center"
              style={{
                borderColor: errors.phone ? '#ef4444' : '#000D59',
                height: 'clamp(60px, 5.9vw, 114px)',
                width: '100%'
              }}
            >
              {/* Phone Icon */}
              <div className="flex items-center justify-center" style={{ width: 'clamp(60px, 5.6vw, 108px)' }}>
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/3350235bd026037b65d1706334d2624c4ede799b?width=78"
                  alt=""
                  style={{
                    width: 'clamp(20px, 1.8vw, 39px)',
                    height: 'clamp(35px, 3.2vw, 69px)'
                  }}
                />
              </div>

              {/* Vertical Divider */}
              <div
                className="bg-[#000D59]"
                style={{
                  width: '5px',
                  height: 'clamp(41px, 3.8vw, 82px)',
                  margin: '0 clamp(10px, 1vw, 20px)'
                }}
              />

              {/* Input */}
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-prompt placeholder-gray-500"
                placeholder="เบอร์โทรศัพท์"
                style={{
                  fontSize: 'clamp(16px, 3.7vw, 40px)',
                  fontWeight: 300,
                  color: 'rgba(0, 0, 0, 0.7)',
                  paddingRight: 'clamp(10px, 1vw, 20px)'
                }}
              />
            </div>
            {errors.phone && (
              <div className="text-red-400 text-sm mt-1 ml-2">
                {errors.phone}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buttons positioned as in Figma */}
      <div className="absolute w-full flex flex-col items-center" style={{ top: '84%', paddingBottom: '2.5rem' }}>
        <div className="flex flex-col" style={{ width: '80.9%', maxWidth: '874px', gap: 'clamp(22px, 2.2vw, 36px)' }}>
          <div className="relative flex justify-center">
            <button
              onClick={handleNext}
              className="transition-all duration-200 bg-[#FFE000] hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group flex items-center justify-center"
              style={{
                width: 'clamp(300px, 78.2vw, 845px)',
                height: 'clamp(50px, 6.1vw, 118px)',
                borderRadius: '50px',
                border: 'none'
              }}
            >
              <span
                className="font-prompt text-center text-black group-hover:text-[#FFE000] group-active:text-[#FFE000]"
                style={{
                  fontSize: 'clamp(18px, 4.6vw, 50px)',
                  fontWeight: 400,
                  letterSpacing: '0.4px',
                  lineHeight: 'normal'
                }}
              >
                ลุ้นรับรางวัล
              </span>
            </button>
          </div>

          <div className="relative flex justify-center">
            <button
              onClick={onBack}
              className="transition-all duration-200 bg-[#FFE000] hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group flex items-center justify-center"
              style={{
                width: 'clamp(300px, 78.2vw, 845px)',
                height: 'clamp(50px, 6.1vw, 118px)',
                borderRadius: '50px',
                border: 'none'
              }}
            >
              <span
                className="font-prompt text-center text-black group-hover:text-[#FFE000] group-active:text-[#FFE000]"
                style={{
                  fontSize: 'clamp(18px, 4.6vw, 50px)',
                  fontWeight: 400,
                  letterSpacing: '0.4px',
                  lineHeight: 'normal'
                }}
              >
                ไม่
              </span>
            </button>
          </div>
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step2_Form;
