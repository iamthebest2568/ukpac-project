import { useState } from "react";

interface Ask05Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const Ask05 = ({ sessionID, onNavigate }: Ask05Props) => {
  const [suggestion, setSuggestion] = useState('');

  const handleNext = () => {
    // Log the user's suggestion to the console
    console.log('User suggestion:', suggestion);
    console.log('Session ID:', sessionID);
    
    const data = { suggestion };
    onNavigate('fakeNews', data);
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Illustration Panel - Suggestion box */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-40 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg relative overflow-hidden">
            {/* Suggestion box visualization */}
            <div className="relative z-10 text-center">
              <div className="text-5xl mb-2" role="img" aria-label="กล่องข้อเสนอแนะ">💡</div>
              <div className="text-caption text-gray-600">แชร์ความคิดเห็นของคุณ</div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-blue-400 rounded-full"></div>
            <div className="absolute top-6 right-6 w-2 h-2 bg-purple-400 rounded-full"></div>
            <div className="absolute bottom-4 left-6 w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="absolute bottom-6 right-4 w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>

        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2 text-center text-black">
            คุณคิดว่ารัฐควรทำอะไร ที่จะทำให้นโยบ���ยนี้เกิดขึ้นได้และเป็นประโยชน์ต่อประชาชนอย่างแท้จริง
          </h1>
        </div>

        {/* Context text */}
        <div className="context-info">
          <p className="text-body text-center text-black">
            ข้อเสนอแนะของคุณมีค่ามากสำหรับการพัฒนานโยบายให้ดีขึ้น
          </p>
        </div>

        {/* Answer Section - Text Input */}
        <div className="answer-section">
          <div className="space-y-4">
            <label 
              htmlFor="suggestion-input" 
              className="block text-body font-medium text-black mb-2"
            >
              ข้อเสนอแนะของคุณ:
            </label>
            <textarea
              id="suggestion-input"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-action focus:border-primary-action text-black placeholder-gray-500"
              placeholder="พิมพ์ข้อความของคุณที่นี่"
              aria-describedby="suggestion-help"
              rows={6}
            />
            <div id="suggestion-help" className="text-caption text-gray-600">
              แชร์ความคิดเห็น ข้อเสนอแนะ หรือแนวทางที่คุณคิดว่าจะช่วยให้นโยบายนี้ประสบความสำเร็จ
            </div>
          </div>
        </div>

        {/* Character counter */}
        <div className="text-right">
          <span className="text-caption text-gray-500">
            {suggestion.length} ตัวอักษร
          </span>
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
          <p className="text-caption text-black">ขั้นตอนที่ 5 จาก 5</p>
        </div>

        {/* Completion Zone */}
        <div className="completion-zone">
          <button 
            className="btn btn-primary"
            onClick={handleNext}
            aria-describedby="next-button-description"
          >
            ต่อไป
          </button>
          
          {suggestion.trim().length === 0 && (
            <div id="next-button-description" className="status-message info mt-4">
              คุณสามารถข้ามขั้นตอนนี้ได้หากไม่มีข้อเสนอแนะเพิ่มเติม
            </div>
          )}
          
          {suggestion.trim().length > 0 && (
            <div className="status-message success mt-4">
              ขอบคุณสำหรับข้อเสนอแนะที่มีค่า!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ask05;
