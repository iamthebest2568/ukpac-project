interface Ask04Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData: any;
}

const Ask04 = ({ sessionID, onNavigate, journeyData }: Ask04Props) => {
  const handleChoice = (choice: 'satisfied' | 'unsatisfied') => {
    const choiceText = {
      satisfied: 'พอใจ',
      unsatisfied: 'ไม่พอใจ'
    }[choice];

    const data = { choice, choiceText };
    
    if (choice === 'satisfied') {
      onNavigate('fakeNews', data);
    } else {
      onNavigate('ask05', data);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="game-container py-8">
        {/* Illustration Panel - Results recap */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-40 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg relative overflow-hidden">
            {/* Results summary visualization */}
            <div className="relative z-10 text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-sm text-gray-600 mb-2">ผลลัพธ์จากการตอบของคุณ</div>
              
              {/* Mini charts/icons representing results */}
              <div className="flex justify-center space-x-4 mt-3">
                <div className="text-center">
                  <div className="text-2xl">🎯</div>
                  <div className="text-xs text-gray-500">นโยบาย</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">👥</div>
                  <div className="text-xs text-gray-500">กลุ่มเป้าหมาย</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">💰</div>
                  <div className="text-xs text-gray-500">งบประมาณ</div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-green-400 rounded-full"></div>
            <div className="absolute top-6 right-6 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute bottom-4 left-6 w-2 h-2 bg-yellow-400 rounded-full"></div>
          </div>
        </div>

        {/* Question */}
        <h2 className="question-text">
          คุณพอใจผลลัพธ์ที่เกิดขึ้นหรือไม่?
        </h2>

        {/* Results summary (if available) */}
        {Object.keys(journeyData).length > 0 && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">สรุปการตอบของคุณ:</h4>
            <div className="space-y-2 text-sm text-gray-700">
              {journeyData.ask01 && (
                <p>• ความคิดเห็นเริ่มต้น: {journeyData.ask01.choiceText}</p>
              )}
              {journeyData.priorities && (
                <p>• นโยบายที่เลือก: {journeyData.priorities.selectedPriorities?.join(', ')}</p>
              )}
              {journeyData.beneficiaries && (
                <p>• กลุ่มผู้ได้รับประโยชน์: {journeyData.beneficiaries.selectedGroups?.length} กลุ่ม</p>
              )}
              {journeyData.budget && (
                <p>• การจัดสรรงบประมาณ: รวม 100 บาท</p>
              )}
            </div>
          </div>
        )}

        {/* Context text */}
        <div className="mb-8 text-center text-gray-600">
          <p>พิจารณาจากการตอบคำถามและกิจกรรมต่างๆ ที่ผ่านมา</p>
        </div>

        {/* Choice buttons */}
        <div className="space-y-4">
          <button 
            className="btn-primary"
            onClick={() => handleChoice('satisfied')}
          >
            😊 พอใจ
          </button>
          
          <button 
            className="btn-primary"
            onClick={() => handleChoice('unsatisfied')}
          >
            😕 ไม่พอใจ
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-game-yellow"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          </div>
          <p className="text-sm text-gray-500">ขั้นตอนที่ 4 จาก 5</p>
        </div>
      </div>
    </div>
  );
};

export default Ask04;
