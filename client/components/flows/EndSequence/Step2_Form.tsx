/**
 * UK PACK - End Sequence Step 2: Reward Form
 * Moved from RewardForm component
 */

import { useState } from "react";
import { logEvent } from '../../../services/dataLogger.js';

interface Step2_FormProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
}

const Step2_Form = ({ sessionID, onNext, onBack, initialData }: Step2_FormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทร';
    } else if (!/^[0-9]{9,10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      // Log the reward form submission
      logEvent({
        event: 'REWARD_FORM_SUBMIT',
        payload: {
          data: formData,
          sessionID
        }
      });

      // Navigate to final thank you
      const data = { rewardForm: formData };
      onNext(data);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="กรอกข้อมูลรับรางวัล"
            className="w-full h-full object-cover object-center"
            style={{ minWidth: "100%", aspectRatio: "2/3" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 44.17%)",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Content Area */}
          <div className="flex-1 flex flex-col justify-end items-center px-6 md:px-8 pb-8 md:pb-12">
            {/* Title */}
            <div className="text-center mb-6 md:mb-8 max-w-[325px]">
              <h1
                className="text-white text-center font-kanit text-3xl font-normal leading-normal mb-6"
                style={{ fontSize: "clamp(24px, 7.5vw, 30px)" }}
              >
                กรอกข้อมูลเพื่อรับรางวัล
              </h1>
            </div>

            {/* Form Section */}
            <div className="w-full max-w-[325px] space-y-4 mb-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-white text-base font-prompt mb-2">
                  ชื่อ *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full h-[53px] rounded-[40px] bg-white border-[1.5px] ${errors.name ? 'border-red-500' : 'border-black'} px-6 text-black font-prompt text-lg placeholder-gray-500`}
                  placeholder="กรุณากรอกชื่อ"
                />
                {errors.name && (
                  <div className="text-red-400 text-sm mt-1 ml-2">{errors.name}</div>
                )}
              </div>

              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-white text-base font-prompt mb-2">
                  เบอร์โทร *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full h-[53px] rounded-[40px] bg-white border-[1.5px] ${errors.phone ? 'border-red-500' : 'border-black'} px-6 text-black font-prompt text-lg placeholder-gray-500`}
                  placeholder="08X-XXX-XXXX"
                />
                {errors.phone && (
                  <div className="text-red-400 text-sm mt-1 ml-2">{errors.phone}</div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full max-w-[325px]">
              <button
                onClick={handleNext}
                className="w-full h-[53px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
              >
                <span className="text-black text-center font-prompt text-lg font-medium leading-7 tracking-[0.4px] group-hover:text-[#EFBA31] group-active:text-[#EFBA31]">
                  ส่งเพื่อลุ้นรับรางวัล
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_Form;
