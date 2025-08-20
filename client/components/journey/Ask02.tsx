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
      onNavigate('priorities', data);
    } else if (choice === 'ineffective') {
      onNavigate('budget', data);
    } else {
      onNavigate('ask02_2', data);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="game-container py-8">
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
              <div className="text-5xl mb-2 transform -rotate-12">🧑‍💼</div>
              <div className="text-xs text-gray-600">กำลังคิด...</div>
            </div>

            {/* Thought bubble */}
            <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md">
              <div className="text-lg">💭</div>
            </div>
          </div>
        </div>

        {/* Question */}
        <h2 className="question-text">
          ทำไมคุณถึงรู้สึกแบบนั้น?
        </h2>

        {/* Additional context */}
        <div className="mb-8 text-center text-gray-600">
          <p>ช่วยเล่าให้เราฟังหน่อยว่าเหตุผลของคุณคืออะไร</p>
        </div>

        {/* Choice buttons */}
        <div className="space-y-4">
          <button 
            className="btn-primary text-left"
            onClick={() => handleChoice('coverage')}
          >
            <span className="mr-3">🎯</span>
            นโยบายไม่ครอบคลุม
          </button>
          
          <button 
            className="btn-primary text-left"
            onClick={() => handleChoice('ineffective')}
          >
            <span className="mr-3">❌</span>
            เก็บไปก็ไม่มีอะไรเกิดขึ้น
          </button>
          
          <button 
            className="btn-primary text-left"
            onClick={() => handleChoice('other')}
          >
            <span className="mr-3">💬</span>
            อื่นๆ
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-game-yellow"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          </div>
          <p className="text-sm text-gray-500">ขั้นตอนที่ 2 จาก 5</p>
        </div>

        {/* Back button */}
        <div className="mt-6 text-center">
          <button 
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
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
