import { useState } from "react";

interface Ask02_2Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const Ask02_2 = ({ sessionID, onNavigate }: Ask02_2Props) => {
  const [textInput, setTextInput] = useState('');

  const handleNext = () => {
    const data = { textInput };
    onNavigate('ask04', data);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="game-container py-8">
        {/* Question */}
        <h2 className="question-text">
          อื่นๆ คืออะไร<br />
          ช่วยบอกเราหน่อยได้ไหม
        </h2>

        {/* Encouragement text */}
        <div className="mb-8 text-center text-gray-600">
          <p>ความคิดเห็นของคุณมีความสำคัญมากต่อการพัฒ���านโยบาย</p>
        </div>

        {/* Text input area */}
        <div className="mb-8">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="กรุณาแบ่งปันความคิดเห็นของคุณ..."
            className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg resize-none focus:border-game-yellow focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
            rows={4}
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
          
          <button 
            className="btn-secondary"
            onClick={() => onNavigate('ask02')}
          >
            กลับไปเลือกใหม่
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-game-yellow"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          </div>
          <p className="text-sm text-gray-500">ขั้นตอนที่ 3 จาก 5</p>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">💡 ตัวอย่างความคิดเห็นที่เป็นประโยชน์:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• กังวลเรื่องผลกระทบต่อผู้มีรายได้น้อย</li>
            <li>• เห็นว่าควรมีระบบขนส่งสาธารณะที่ดีกว่าก่อน</li>
            <li>• ต้องการให้มีการศึกษาผลกระทบเพิ่มเติม</li>
            <li>• มีข้อเสนอแนะ��ชิงนโยบาย</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Ask02_2;
