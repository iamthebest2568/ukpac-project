interface RewardDecisionProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const RewardDecision = ({ sessionID, onNavigate }: RewardDecisionProps) => {
  const handleChoice = (choice: 'participate' | 'decline') => {
    const data = { rewardChoice: choice };
    
    if (choice === 'participate') {
      onNavigate('rewardForm', data);
    } else {
      onNavigate('finalThankYou', data);
    }
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Thank you and reward offer section */}
        <div className="question-section">
          <div className="text-center mb-8">
            {/* Celebration icon */}
            <div className="text-6xl mb-4" role="img" aria-label="ขอบคุณ">🎉</div>
            
            <h1 className="text-h1 mb-6">
              ขอบคุณที่ร่วมเป็นส่วนหนึ่ง<br />
              ในการพัฒนาเมือง
            </h1>
            
            <p className="text-body text-text-primary leading-relaxed mb-8">
              อยากกรอกข้อมูลเพิ่มเติมเพื่อลุ้นรับรางวัล<br />
              <strong className="text-primary-action">บัตรเดินทางมูลค่า 300 บาท</strong><br />
              หรือไม่
            </p>
          </div>
        </div>

        {/* Reward details */}
        <div className="context-info bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-warning">
          <h3 className="text-body font-bold text-text-primary mb-3">🎁 รายละเอียดรางวัล</h3>
          <ul className="text-caption text-text-secondary space-y-2">
            <li className="flex items-start">
              <span className="mr-2 text-success">✓</span>
              <span>บัตรเดินทางสำหรับระบบขนส่งสาธารณะ มูลค่า 300 บาท</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-success">✓</span>
              <span>ใช้ได้กับ BTS, MRT, และรถโดยสารประจำทาง</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-success">✓</span>
              <span>ระยะเวลาการจับรางวัล: 7 วันหลังสิ้นสุดแบบสำรวจ</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-success">✓</span>
              <span>ข้อมูลจะถูกใช้เพื่อการออกรางวัลเท่านั้น</span>
            </li>
          </ul>
        </div>

        {/* Answer Section - Choice buttons */}
        <div className="answer-section">
          <div className="space-y-4">
            <button 
              className="btn btn-primary text-center"
              onClick={() => handleChoice('participate')}
              aria-describedby="participate-description"
            >
              <span className="mr-3" role="img" aria-label="รา���วัล">🎁</span>
              ลุ้นรับรางวัล
            </button>
            <div id="participate-description" className="sr-only">
              เข้าร่วมการจับรางวัลบัตรเดินทางมูลค่า 300 บาท
            </div>
            
            <button 
              className="btn btn-secondary text-center"
              onClick={() => handleChoice('decline')}
              aria-describedby="decline-description"
            >
              <span className="mr-3" role="img" aria-label="ไม่เอา">❌</span>
              ไม่
            </button>
            <div id="decline-description" className="sr-only">
              ไม่เข้าร่วมการจับรางวัลและจบการสำรวจ
            </div>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="status-message info">
          <strong>🔒 ความเป็นส่วนตัว:</strong> ข้อมูลที่คุณให้จะถูกเก็บรักษาอย่างปลอดภัยและใช้เพื่อการจับรางวัลเท่านั้น
        </div>

        {/* Progress indicator - Final step */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="การสำรวจเสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ตรวจสอบข้อมูลเสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="เลือกแหล่งข่าวเสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="ขั้นตอนสุดท้าย กำลังดำเนินการ"></div>
          </div>
          <p className="text-caption">ขั้นตอนสุดท้าย</p>
        </div>
      </div>
    </div>
  );
};

export default RewardDecision;
