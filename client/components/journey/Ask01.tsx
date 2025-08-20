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
    <div className="bg-white min-h-screen">
      <div className="game-container py-8">
        {/* Illustration Panel - Two characters talking on train */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-40 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg relative overflow-hidden">
            {/* Train interior background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 opacity-30"></div>
            
            {/* Two characters talking */}
            <div className="relative z-10 flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl mb-2">🧑‍💼</div>
                <div className="text-xs text-gray-600">นักธุรกิจ</div>
              </div>
              
              {/* Speech bubble */}
              <div className="relative bg-white p-3 rounded-lg shadow-md max-w-xs">
                <div className="text-sm text-gray-800 font-medium">
                  "นโยบายนี้จะช่วยลดความแออัดได้จริงไหมนะ?"
                </div>
                <div className="absolute -left-2 top-4 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-white"></div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-2">👩‍🎓</div>
                <div className="text-xs text-gray-600">นักศึกษา</div>
              </div>
            </div>
            
            {/* Train window view */}
            <div className="absolute top-2 right-4 w-16 h-8 bg-sky-200 rounded border-2 border-gray-300">
              <div className="h-full bg-gradient-to-b from-sky-300 to-green-300"></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <h2 className="question-text">
          คุณคิดเห็นอย่างไรกับนโยบายนี้?
        </h2>

        {/* Context about the policy */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-gray-700 text-sm leading-relaxed">
            <strong>นโยบายการเก็บค่าธรรมเนียมการใช้รถยนต์ส่วนบุคคลในเขตเมือง</strong><br />
            เพื่อลดปัญหาการจราจรติดขัดและส่งเสริมการใช้ระบบขนส่งสาธารณะ
          </p>
        </div>

        {/* Choice buttons */}
        <div className="space-y-4">
          <button 
            className="btn-primary"
            onClick={() => handleChoice('agree')}
          >
            😊 เห็นด้วย
          </button>
          
          <button 
            className="btn-primary"
            onClick={() => handleChoice('neutral')}
          >
            😐 กลางๆ
          </button>
          
          <button 
            className="btn-primary"
            onClick={() => handleChoice('disagree')}
          >
            😟 ไม่เห็นด้วย
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-game-yellow"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          </div>
          <p className="text-sm text-gray-500">ขั้นตอนที่ 1 จาก 5</p>
        </div>
      </div>
    </div>
  );
};

export default Ask01;
