interface Ask01Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const Ask01 = ({ sessionID, onNavigate }: Ask01Props) => {
  const handleChoice = (choice: 'agree' | 'neutral' | 'disagree') => {
    const choiceText = {
      agree: 'เห็นด้วย',
      neutral: 'กลางๆ',
      disagree: 'ไม่เห็นด้วย'
    }[choice];

    const data = { choice, choiceText };
    
    if (choice === 'agree') {
      onNavigate('fakeNews', data);
    } else {
      onNavigate('ask02', data);
    }
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Illustration Panel - Two characters talking on train */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-40 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg relative overflow-hidden">
            {/* Train interior background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 opacity-30"></div>
            
            {/* Two characters talking */}
            <div className="relative z-10 flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl mb-2" role="img" aria-label="นักธุรกิจ">🧑‍💼</div>
                <div className="text-caption text-gray-600">นักธุรกิจ</div>
              </div>
              
              {/* Speech bubble */}
              <div className="relative bg-white p-3 rounded-lg shadow-md max-w-xs">
                <div className="text-caption text-gray-800 font-medium">
                  "นโยบายนี้จะช่วยลดความแออัดได้จริงไหมนะ?"
                </div>
                <div className="absolute -left-2 top-4 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-white"></div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-2" role="img" aria-label="นักศึกษา">👩‍🎓</div>
                <div className="text-caption text-gray-600">นักศึกษา</div>
              </div>
            </div>
            
            {/* Train window view */}
            <div className="absolute top-2 right-4 w-16 h-8 bg-sky-200 rounded border-2 border-gray-300" role="img" aria-label="หน้าต่างรถไฟ">
              <div className="h-full bg-gradient-to-b from-sky-300 to-green-300"></div>
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2">
            คุณคิดเห็นอย่างไรกับนโยบายนี้?
          </h1>
        </div>

        {/* Context about the policy */}
        <div className="context-info">
          <p className="text-body leading-relaxed">
            <strong>นโยบายการเก็บค่าธรรมเนียมการใช้รถยนต์ส่วนบุคคลในเขตเมือง</strong><br />
            เพื่อลดปัญหาการจ���าจรติดขัดและส่งเสริมการใช้ระบบขนส่งสาธารณะ
          </p>
        </div>

        {/* Answer Section - Choice buttons */}
        <div className="answer-section">
          <div className="space-y-4">
            <button 
              className="btn btn-primary text-left"
              onClick={() => handleChoice('agree')}
              aria-describedby="agree-description"
            >
              <span className="mr-3" role="img" aria-label="เห็นด้วย">😊</span>
              เห็นด้วย
            </button>
            <div id="agree-description" className="sr-only">
              เห็นด้วยกับนโยบายการเก็บค่าธรรมเนียมรถยนต์ส่วนบุคคล
            </div>
            
            <button 
              className="btn btn-primary text-left"
              onClick={() => handleChoice('neutral')}
              aria-describedby="neutral-description"
            >
              <span className="mr-3" role="img" aria-label="เฉยๆ">😐</span>
              กลางๆ
            </button>
            <div id="neutral-description" className="sr-only">
              มีความเห็นเป็นกลางต่อนโยบายนี้
            </div>
            
            <button 
              className="btn btn-primary text-left"
              onClick={() => handleChoice('disagree')}
              aria-describedby="disagree-description"
            >
              <span className="mr-3" role="img" aria-label="ไม่เห็นด้วย">😟</span>
              ไม่เห็นด้วย
            </button>
            <div id="disagree-description" className="sr-only">
              ไม่เห็นด้วยกับนโยบายการเก็บค่าธรรมเนียมรถยนต์ส่วนบุคคล
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot active" aria-label="ขั้นตอนที่ 1 กำลังดำเนินการ"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 2"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 3"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 4"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 5"></div>
          </div>
          <p className="text-caption">ขั้นตอนที่ 1 จาก 5</p>
        </div>

        {/* Additional guidance */}
        <div className="status-message info">
          กรุณาเลือกความคิดเห็นที่ตรงกับความรู้สึกของคุณมากที่สุด
        </div>
      </div>
    </div>
  );
};

export default Ask01;
