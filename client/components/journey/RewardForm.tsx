import { useState } from "react";

interface RewardFormProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const RewardForm = ({ sessionID, onNavigate }: RewardFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: ''
  });

  const validateForm = () => {
    const newErrors = { name: '', phone: '' };
    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ';
      isValid = false;
    }

    // Validate phone number
    if (!formData.phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทร';
      isValid = false;
    } else if (!/^[0-9]{9,10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรที่ถูกต้อง (9-10 หลัก)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Log form data to console as requested
      console.log({
        sessionID,
        game: 'rewardForm',
        data: formData
      });

      // Navigate to final thank you
      onNavigate('finalThankYou', formData);
    }
  };

  const handleGoBack = () => {
    onNavigate('rewardDecision');
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Header Section */}
        <div className="question-section">
          <h1 className="text-h2 mb-4">
            กรอกข้อมูลเพื่อรับรางวัล
          </h1>
          
          <div className="text-center">
            <div className="text-4xl mb-3" role="img" aria-label="แบบฟอร์ม">📝</div>
            <p className="text-body text-text-secondary">
              กรุณาก���อกข้อมูลของคุณเพื่อเข้าร่วมการจับรางวัล
            </p>
          </div>
        </div>

        {/* Reward reminder */}
        <div className="context-info bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-warning">
          <div className="flex items-center">
            <span className="text-2xl mr-3" role="img" aria-label="รางวัล">🎁</span>
            <div>
              <h3 className="text-body font-bold text-text-primary">บัตรเดินทางมูลค่า 300 บาท</h3>
              <p className="text-caption text-text-secondary">ใช้ได้กับ BTS, MRT และรถโดยสารประจำทาง</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="answer-section">
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-body font-medium text-text-primary mb-2">
                ชื่อ <span className="text-error">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-error' : ''}`}
                placeholder="กรุณากรอกชื่อของคุณ"
                aria-describedby={errors.name ? 'name-error' : 'name-help'}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <div id="name-error" className="mt-1 text-caption text-error">
                  {errors.name}
                </div>
              )}
              <div id="name-help" className="mt-1 text-caption text-text-secondary">
                ชื่อที่ใช้ในการติดต่อเมื่อได้รับรางวัล
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-body font-medium text-text-primary mb-2">
                เบอร์โทร <span className="text-error">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`input-field ${errors.phone ? 'border-error' : ''}`}
                placeholder="08X-XXX-XXXX"
                aria-describedby={errors.phone ? 'phone-error' : 'phone-help'}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <div id="phone-error" className="mt-1 text-caption text-error">
                  {errors.phone}
                </div>
              )}
              <div id="phone-help" className="mt-1 text-caption text-text-secondary">
                เบอร์โทรศัพท์ที่สามารถติดต่อได้
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="completion-zone">
          <div className="space-y-4">
            <button 
              className="btn btn-primary"
              onClick={handleSubmit}
              aria-describedby="submit-description"
            >
              <span className="mr-3" role="img" aria-label="ส่ง">���</span>
              ส่งเพื่อลุ้นรับรางวัล
            </button>
            <div id="submit-description" className="sr-only">
              ส่งข้อมูลเพื่อเข้าร่วมการจับรางวัล
            </div>
            
          </div>
        </div>

        {/* Privacy notice */}
        <div className="status-message info">
          <strong>🔒 ข้อมูลส่วนตัว:</strong> ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัยและใช้เพื่อการติดต่อเมื่อได้รับรางวัลเท่านั้น
        </div>

        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="การสำรวจเสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="เลือ��รางวัลเสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="กรอกข้อมูล กำลังดำเนินการ"></div>
            <div className="progress-dot inactive" aria-label="เสร็จสิ้น"></div>
          </div>
          <p className="text-caption">กรอกข้อมูลสำหรับรางวัล</p>
        </div>
      </div>
    </div>
  );
};

export default RewardForm;
