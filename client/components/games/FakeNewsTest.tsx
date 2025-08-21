import { logEvent } from '../../services/dataLogger.js';

interface FakeNewsTestProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const FakeNewsTest = ({ sessionID, onNavigate }: FakeNewsTestProps) => {
  const handleAction = (action: 'search' | 'ignore') => {
    const data = { action };

    // Log the fake news interaction
    logEvent({
      event: 'FAKENEWS_CHOICE',
      payload: {
        choice: action,
        scenario: 'ข่าวเรื่องการเปลี่ยนแปลงค่าโดยสาร',
        sessionID
      }
    });

    if (action === 'search') {
      // Navigate to source selection for the 'Agree' journey
      onNavigate('sourceSelection', data);
    } else {
      // Navigate directly to Flow_EndSequence (reward decision flow)
      onNavigate('Flow_EndSequence', data);
    }
  };

  return (
    <div className="theme-dark min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Illustration Panel */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-32 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg relative overflow-hidden">
            {/* Stylized train moving through dark city */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
            <div className="relative z-10 text-center">
              <div className="text-4xl mb-2" role="img" aria-label="รถไฟในเมืองยามค่ำคืน">🚆</div>
              <div className="text-caption text-gray-300">รถไฟในเมืองยามค่ำคืน</div>
            </div>
            {/* City silhouette */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent">
              <div className="flex justify-center space-x-2 h-full items-end">
                <div className="w-3 h-6 bg-gray-800" role="img" aria-label="อาคารในเมือง"></div>
                <div className="w-2 h-4 bg-gray-700"></div>
                <div className="w-4 h-8 bg-gray-800"></div>
                <div className="w-2 h-3 bg-gray-700"></div>
                <div className="w-3 h-7 bg-gray-800"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2">
            ข้อมูลขัดแย้งกัน คุณจะทำอย่างไร?
          </h1>
        </div>

        {/* Content Text */}
        <div className="context-info bg-gray-800 bg-opacity-50 border-l-4 border-warning">
          <p className="text-body text-white leading-relaxed">
            ตอนนี้มีข้อมูลที่ขัดแย้งกันของนโยบาย เช่น บางทีบอกว่าเก็บ 20 บ้าง ก็ 80 บ้าง 
            บ้างก็บอกว่า ไม่เก็บ รถ 4 ที่นั่ง บ้างก็เก็บหมด 
            <strong>คุณคิดว่าจะทำอย่างไร</strong>
          </p>
        </div>

        {/* Answer Section - Action Buttons */}
        <div className="answer-section">
          <div className="space-y-4">
            {/* Secondary action first - less prominent */}
            <button 
              className="btn btn-secondary"
              onClick={() => handleAction('ignore')}
              aria-describedby="ignore-description"
            >
              <span className="mr-3" role="img" aria-label="รอดู">⏳</span>
              ไม่ทำอะไร ถึงเวลาก็รู้เอง
            </button>
            <div id="ignore-description" className="sr-only">
              เลือกที่จะไม่ดำเนินการใดๆ และรอดูผลลัพธ์</div>
            
            {/* Primary action - more prominent */}
            <button 
              className="btn btn-primary"
              onClick={() => handleAction('search')}
              aria-describedby="search-description"
            >
              <span className="mr-3" role="img" aria-label="ค้นหา">🔍</span>
              หาข่าวต่อ
            </button>
            <div id="search-description" className="sr-only">
              เลือกที่จะหาข้อมูลเพิ่มเติมเพื่อตรวจสอบความถูกต้อง
            </div>
          </div>
        </div>

        {/* Information about the importance of information verification */}
        <div className="status-message info">
          <strong>💡 เคล็ดลับ:</strong> การตรวจสอบข้อมูลจากหลายแหล่งช่วยให้เราตัดสินใจได้อย่างมีข้อมูล
        </div>

        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 1 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 2 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 3 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 4 เสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="ขั้นตอนสุดท้าย กำลังดำเนินการ"></div>
          </div>
          <p className="text-caption">ขั้นตอนสุดท้าย</p>
        </div>
      </div>
    </div>
  );
};

export default FakeNewsTest;
