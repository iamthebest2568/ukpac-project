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
      title="กรอกข้อมูล เพื่อรับรางวัล"
      className="source-selection-page endseq-form-page"
      imageLoading="eager"
    >
      {/* Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 md:px-8" style={{ paddingTop: '4%', paddingBottom: '18%' }}>
        <div className="w-full max-w-[336px]">
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
    </FigmaStyle1Layout>
  );
};

export default Step2_Form;
