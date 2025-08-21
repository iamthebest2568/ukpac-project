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
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Illustration Panel - Form visualization */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-40 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg relative overflow-hidden">
            {/* Form elements */}
            <div className="relative z-10 text-center">
              <div className="text-5xl mb-2" role="img" aria-label="แบบฟอร์ม">📝</div>
              <div className="text-caption text-gray-600">กรอกข้อมูลรับรางวัล</div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 left-4 text-xl" role="img" aria-label="ปากกา">✏️</div>
            <div className="absolute top-6 right-6 text-lg" role="img" aria-label="เช็ค">✅</div>
            <div className="absolute bottom-4 left-6 text-lg" role="img" aria-label="ซอง">✉️</div>
            <div className="absolute bottom-4 right-4 text-xl" role="img" aria-label="โทรศัพท์">📱</div>
          </div>
        </div>

        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2 text-center text-black">
            กรอกข้อมูลเพื่อรับรางวัล
          </h1>
        </div>

        {/* Form Section */}
        <div className="answer-section">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-body font-medium text-black mb-2">
                ชื่อ *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-error' : ''}`}
                placeholder="กรุณากรอกชื่อ"
              />
              {errors.name && (
                <div className="text-error text-caption mt-1">{errors.name}</div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-body font-medium text-black mb-2">
                เบอร์โทร *
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`input-field ${errors.phone ? 'border-error' : ''}`}
                placeholder="08X-XXX-XXXX"
              />
              {errors.phone && (
                <div className="text-error text-caption mt-1">{errors.phone}</div>
              )}
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="context-info">
          <h4 className="text-body font-bold text-black mb-2">🔒 ความเป็นส่วนตัว:</h4>
          <ul className="text-caption text-gray-600 space-y-1">
            <li>• ข้อมูลจะถูกใช้เฉพาะสำหรับการจัดส่งรางวัลเท่านั้น</li>
            <li>• เราจะไม่แชร์ข้อมูลให้กับบุคคลที่สาม</li>
            <li>• คุณสามารถขอลบข้อมูลได้ตลอดเวลา</li>
          </ul>
        </div>

        {/* Completion Zone */}
        <div className="completion-zone">
          <button 
            className="btn btn-primary"
            onClick={handleNext}
          >
            ส่งเพื่อลุ้นรับรางวัล
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2_Form;
