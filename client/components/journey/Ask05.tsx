import { useState } from "react";

interface Ask05Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const Ask05 = ({ sessionID, onNavigate }: Ask05Props) => {
  const [textInput, setTextInput] = useState('');

  const handleNext = () => {
    const data = { suggestion: textInput };
    onNavigate('fakeNews', data);
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2 mb-6">
            คุณคิดว่ารัฐควรทำอะไร<br />
            ที่จะทำให้นโยบายนี้เกิดขึ้นได้<br />
            และเป็นประโยชน์ต่อประชาช��<br />
            อย่างแท้จริง?
          </h1>
        </div>

        {/* Encouragement text */}
        <div className="context-info">
          <p className="text-body text-center leading-relaxed">
            ข้อเสนอแนะของคุณจะช่วยให้นโยบายมีความเป็นไปได้และเป็นประโยชน์มากขึ้น
          </p>
        </div>

        {/* Text input area */}
        <div className="answer-section">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="แบ่งปันข้อเสนอแนะของคุณเพื่อให้นโยบายนี้ประสบความสำเร็จ..."
            className="input-field h-40 resize-none"
            rows={5}
            aria-describedby="character-count"
          />
          <div id="character-count" className="text-right text-caption mt-2">
            {textInput.length} ตัวอักษร
          </div>
        </div>

        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 1 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 2 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 3 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 4 เสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="ขั้นตอนที่ 5 กำลังดำเนินการ"></div>
          </div>
          <p className="text-caption">ขั้นตอนที่ 5 จาก 5</p>
        </div>

        {/* Completion Zone */}
        <div className="completion-zone">
          <button 
            className="btn btn-primary"
            onClick={handleNext}
            disabled={textInput.trim().length === 0}
            aria-describedby="next-button-description"
          >
            ต่อไป
          </button>
          
          {textInput.trim().length === 0 && (
            <div id="next-button-description" className="status-message info mt-4">
              กรุณากรอ��ข้อเสนอแนะเพื่อดำเนินการต่อ
            </div>
          )}
        </div>

        {/* Tips for suggestions */}
        <div className="context-info">
          <h4 className="text-body font-bold text-text-primary mb-2">💡 ตัวอย่างข้อเสนอแนะที่เป็นประโยชน์:</h4>
          <ul className="text-caption text-text-secondary space-y-1">
            <li>• ควรปรับปรุงระบบขนส่งสาธารณะให้ดีกว่าก่อน</li>
            <li>• จัดหาทางเลือกสำหรับผู้ที่ได้รับผลกระทบ</li>
            <li>• มีการชดเชยหรือสวัสดิการเพิ่มเติม</li>
            <li>• จัดให้มีการประชาสัมพันธ์และชี้แจงที่ชัดเจน</li>
            <li>• มีการทดลองใช้ในพื้นที่เฉพาะก่อน</li>
            <li>• ปรับอัตราให้เหมาะสมกับรายได้ของประชาชน</li>
          </ul>
        </div>

        {/* Back button */}
        <div className="mt-6 text-center">
          <button 
            className="btn btn-secondary text-sm max-w-xs"
            onClick={() => onNavigate('ask04')}
          >
            ← กลับไปหน้าก่อน
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ask05;
