interface Ask02Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const Ask02 = ({ sessionID, onNavigate }: Ask02Props) => {
  const handleChoice = (choice: 'coverage' | 'ineffective' | 'other') => {
    const choiceText = {
      coverage: 'นโยบายไม่ครอบคลุม',
      ineffective: 'เก็บไปก็ไม่มีอะไรเกิดขึ้น',
      other: 'อื่นๆ'
    }[choice];

    const data = { choice, choiceText };
    
    if (choice === 'coverage') {
      onNavigate('Flow_MiniGame_MN1', data);
    } else if (choice === 'ineffective') {
      onNavigate('Flow_MiniGame_MN3', data);
    } else {
      onNavigate('ask02_2', data);
    }
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Illustration Panel - Character on escalator */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-40 bg-gradient-to-b from-gray-100 to-blue-100 rounded-lg relative overflow-hidden">
            {/* Escalator structure */}
            <div className="absolute inset-0">
              {/* Escalator rails */}
              <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-400 transform rotate-12"></div>
              <div className="absolute right-1/4 top-0 bottom-0 w-px bg-gray-400 transform rotate-12"></div>
              
              {/* Escalator steps */}
              <div className="absolute left-1/4 top-1/4 w-1/2 h-2 bg-gray-300 transform rotate-12 opacity-70"></div>
              <div className="absolute left-1/4 top-1/2 w-1/2 h-2 bg-gray-300 transform rotate-12 opacity-70"></div>
              <div className="absolute left-1/4 top-3/4 w-1/2 h-2 bg-gray-300 transform rotate-12 opacity-70"></div>
            </div>
            
            {/* Character on escalator */}
            <div className="relative z-10 text-center">
              <div className="text-5xl mb-2 transform -rotate-12" role="img" aria-label="บุคคลกำลังคิดบนบันไดเลื่อน">🧑‍💼</div>
              <div className="text-caption text-gray-600">กำลังคิด...</div>
            </div>

            {/* Thought bubble */}
            <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md">
              <div className="text-lg" role="img" aria-label="ความคิด">💭</div>
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2">
            ทำไมคุณถึงรู้สึกแบบนั้น?
          </h1>
        </div>

        {/* Context */}
        <div className="context-info">
          <p className="text-body text-center">
            ช่วยเล่าให้เราฟังหน่อยว่าเหตุผลของคุณคืออะไร
          </p>
        </div>

        {/* Answer Section - Choice buttons */}
        <div className="answer-section">
          <div className="space-y-4">
            <button 
              className="btn btn-primary text-left"
              onClick={() => handleChoice('coverage')}
              aria-describedby="coverage-description"
            >
              <span className="mr-3" role="img" aria-label="ครอบคลุม">🎯</span>
              นโยบายไม่ครอบคลุม
            </button>
            <div id="coverage-description" className="sr-only">
              เห็นว่านโยบายยังไม่ครอบคลุมประเด็นสำคัญ</div>
            
            <button 
              className="btn btn-primary text-left"
              onClick={() => handleChoice('ineffective')}
              aria-describedby="ineffective-description"
            >
              <span className="mr-3" role="img" aria-label="ไม่มีประสิทธิภาพ">❌</span>
              เก็บไปก็ไม่มีอะไรเกิดขึ้น
            </button>
            <div id="ineffective-description" className="sr-only">
              เห็นว่าการเก็บเงินอาจไม่ส่งผลต่อการแก้ปัญหา
            </div>
            
            <button 
              className="btn btn-primary text-left"
              onClick={() => handleChoice('other')}
              aria-describedby="other-description"
            >
              <span className="mr-3" role="img" aria-label="อื่นๆ">💬</span>
              อื่นๆ
            </button>
            <div id="other-description" className="sr-only">
              มีเหตุผลอื่นที่ต้องการแสดงความคิดเห็น
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 1 เสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="ขั้นตอนที่ 2 กำลังดำเนินการ"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 3"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 4"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 5"></div>
          </div>
          <p className="text-caption">ขั้นตอนที่ 2 จาก 5</p>
        </div>

        {/* Navigation help */}
        <div className="completion-zone">
          <button 
            className="btn btn-secondary text-sm"
            onClick={() => onNavigate('ask01')}
          >
            ← กลับไปหน้าก่อน
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ask02;
