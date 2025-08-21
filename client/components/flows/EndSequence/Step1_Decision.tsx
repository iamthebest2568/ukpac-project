/**
 * UK PACK - End Sequence Step 1: Reward Decision
 * Moved from RewardDecision component
 */

interface Step1_DecisionProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
}

const Step1_Decision = ({ sessionID, onNext, onBack, initialData }: Step1_DecisionProps) => {
  const handleChoice = (choice: 'participate' | 'decline') => {
    const choiceText = {
      participate: 'ลุ้นรับรางวัล',
      decline: 'ไม่'
    }[choice];

    const data = { rewardDecision: { choice, choiceText } };
    onNext(data);
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Illustration Panel - Reward visualization */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-40 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg relative overflow-hidden">
            {/* Gift and reward elements */}
            <div className="relative z-10 text-center">
              <div className="text-5xl mb-2" role="img" aria-label="รางวัล">🎁</div>
              <div className="text-caption text-gray-600">รางวัลสำหรับคุณ</div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 left-4 text-2xl" role="img" aria-label="เหรียญ">🪙</div>
            <div className="absolute top-6 right-6 text-xl" role="img" aria-label="ดาว">⭐</div>
            <div className="absolute bottom-4 left-6 text-lg" role="img" aria-label="ใบเซอร์">🎫</div>
            <div className="absolute bottom-4 right-4 text-2xl" role="img" aria-label="ของขวัญ">🎉</div>
          </div>
        </div>

        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2 text-center text-black">
            ขอบคุณที่ร่วมเป็นส่วนหนึ่งในการพัฒนาเมือง อยากกรอกข้อมูลเพิ่มเติมเพื่อลุ้นรับรางวัลบัตรเดินทางมูลค่า 300 บาท หรือไม่
          </h1>
        </div>

        {/* Answer Section - Choice buttons */}
        <div className="answer-section">
          <div className="space-y-4">
            <button 
              className="btn btn-primary text-left"
              onClick={() => handleChoice('participate')}
              aria-describedby="participate-description"
            >
              <span className="mr-3" role="img" aria-label="ลุ้นรับรางวัล">✅</span>
              ลุ้นรับรางวัล
            </button>
            <div id="participate-description" className="sr-only">
              เข้าร่วมโครงการและกรอกข้อมูลเพื่อรับรางวัล
            </div>
            
            <button 
              className="btn btn-secondary text-left"
              onClick={() => handleChoice('decline')}
              aria-describedby="decline-description"
            >
              <span className="mr-3" role="img" aria-label="ไม่">❌</span>
              ไม่
            </button>
            <div id="decline-description" className="sr-only">
              ไม่เข้าร่วมโครงการรับรางวัล
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="context-info">
          <h4 className="text-body font-bold text-black mb-2">💡 เกี่ยวกับรางวัล:</h4>
          <ul className="text-caption text-gray-600 space-y-1">
            <li>• รางวัลจะถูกส่งทางอีเมลหรือ SMS</li>
            <li>• ไม่มีค่าใช้จ่ายใดๆ</li>
            <li>• ข้อมูลจะถูกเก็บเป็นความลับ</li>
            <li>• สามารถยกเลิกได้ตลอดเวลา</li>
          </ul>
        </div>

        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 1 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 2 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 3 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 4 เสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="ขั้นตอนที่ 5 กำลั��ดำเนินการ"></div>
          </div>
          <p className="text-caption text-black">ขั้นตอนที่ 5 จาก 5</p>
        </div>
      </div>
    </div>
  );
};

export default Step1_Decision;
