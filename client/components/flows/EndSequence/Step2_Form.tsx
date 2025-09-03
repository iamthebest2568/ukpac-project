/**
 * UK PACK - End Sequence Step 2: Reward Form
 * Moved from RewardForm component
 */

import { useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";

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
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="กรอกข้อมูลรับรางวัล"
            className="w-full h-full object-cover object-center"
            style={{ minWidth: "100%", aspectRatio: "2/3" }}
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0, 0, 0, 0.90)",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Content Area */}
          <div className="flex-1 flex flex-col justify-center items-center px-6 md:px-8">
            {/* Form Container */}
            <div className="w-full max-w-[336px]">
              {/* Title */}
              <div className="text-center mb-20">
                <h1 className="text-white text-center font-kanit text-[30px] font-normal leading-normal">
                  กรอกข้อมูล เพื่อรับรางวัล
                </h1>
              </div>

              {/* Form Section */}
              <div className="space-y-5 mb-12">
                {/* Name Input */}
                <div>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full h-[50px] rounded-[10px] bg-white border ${errors.name ? "border-red-500" : "border-[#E4E9F2]"} px-4 text-black font-prompt text-base placeholder-gray-400 focus:outline-none focus:border-[#EFBA31]`}
                    placeholder="ชื่อ"
                  />
                  {errors.name && (
                    <div className="text-red-400 text-sm mt-1 ml-2">
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full h-[50px] rounded-[10px] bg-white border ${errors.phone ? "border-red-500" : "border-[#E4E9F2]"} px-4 text-black font-prompt text-base placeholder-gray-400 focus:outline-none focus:border-[#EFBA31]`}
                    placeholder="เบอร์โทรศัพท์"
                  />
                  {errors.phone && (
                    <div className="text-red-400 text-sm mt-1 ml-2">
                      {errors.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                {/* Submit Button */}
                <button
                  onClick={handleNext}
                  className="figma-style1-button"
                  aria-describedby="submit-button-description"
                >
                  <span
                    className="figma-style1-button-text"
                    id="submit-button-description"
                  >
                    ส่งเพื่อลุ้นรับรางวัล
                  </span>
                </button>

                {/* Back Button */}
                <button
                  onClick={onBack}
                  className="figma-style1-button--secondary"
                  aria-label="กลับไปก่อนหน้านี้"
                >
                  <span className="figma-style1-button-text">
                    กลับไปก่อนหน้านี้
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_Form;
