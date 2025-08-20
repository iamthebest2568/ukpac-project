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
    <div className="bg-white min-h-screen">
      <div className="game-container py-8">
        {/* Question */}
        <h2 className="question-text mb-6">
          คุณคิดว่ารัฐควรทำอะไร<br />
          ที่จะทำให้นโยบายนี้เกิดขึ้นได้<br />
          และเป็นประโยชน์ต่อประชาชน<br />
          อย่างแท้จริง?
        </h2>

        {/* Encouragement text */}
        <div className="mb-8 text-center text-gray-600">
          <p className="leading-relaxed">
            ข้อเสนอแนะของคุณจะช่วยให้นโยบายมีความเป็นไปได้และเป็นประโยชน์มากขึ้น
          </p>
        </div>

        {/* Text input area */}
        <div className="mb-8">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="แบ่งปันข้อเสนอแนะของคุณเพื่อให้นโยบายนี้ประสบความสำเร็จ..."
            className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg resize-none focus:border-game-yellow focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
            rows={5}
          />
          <div className="text-right text-sm text-gray-400 mt-2">
            {textInput.length} ตัวอักษร
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <button 
            className="btn-primary"
            onClick={handleNext}
            disabled={textInput.trim().length === 0}
          >
            ต่อไป
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-game-yellow"></div>
          </div>
          <p className="text-sm text-gray-500">ขั้นตอนที่ 5 จาก 5</p>
        </div>

        {/* Tips for suggestions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">💡 ตัวอย่างข้อเสนอแนะที่เป็นประโยชน์:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• ควรปรับปรุงระบบขนส่งสาธารณะให้ดีกว่าก่อน</li>
            <li>• จัดหาทางเลือกสำหรับผู้ที่ได้รับผลกระ��บ</li>
            <li>• มีการชดเชยหรือสวัสดิการเพิ่มเติม</li>
            <li>• จัดให้มีการประชาสัมพันธ์และชี้แจงที่ชัดเจน</li>
            <li>• มีการทดลองใช้ในพื้นที่เฉพาะก่อน</li>
            <li>• ปรับอัตราให้เหมาะสมกับรายได้ของประชาชน</li>
          </ul>
        </div>

        {/* Back button */}
        <div className="mt-6 text-center">
          <button 
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
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
