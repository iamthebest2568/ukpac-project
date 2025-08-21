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
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Illustration Panel - Results recap */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-40 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg relative overflow-hidden">
            {/* Results summary visualization */}
            <div className="relative z-10 text-center">
              <div className="text-4xl mb-2" role="img" aria-label="ผลลัพธ์">📊</div>
              <div className="text-caption text-gray-600 mb-2">ผลลัพธ์จากการตอบของคุณ</div>
              
              {/* Mini charts/icons representing results */}
              <div className="flex justify-center space-x-4 mt-3">
                <div className="text-center">
                  <div className="text-2xl" role="img" aria-label="นโยบาย">🎯</div>
                  <div className="text-micro text-gray-500">นโยบาย</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl" role="img" aria-label="กลุ่มเป้าหมาย">👥</div>
                  <div className="text-micro text-gray-500">กลุ่มเป้าหมาย</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl" role="img" aria-label="งบประมาณ">💰</div>
                  <div className="text-micro text-gray-500">งบประมาณ</div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-success rounded-full"></div>
            <div className="absolute top-6 right-6 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute bottom-4 left-6 w-2 h-2 bg-warning rounded-full"></div>
          </div>
        </div>

        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2">
            คุณพอใจผลลัพธ์ที่เกิดขึ้นหรือไม่?
          </h1>
        </div>

        {/* Results summary (if available) */}
        {Object.keys(journeyData).length > 0 && (
          <div className="context-info">
            <h4 className="text-body font-bold text-text-primary mb-3">สรุปการตอบของคุณ:</h4>
            <div className="space-y-2 text-caption text-text-secondary">
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
        <div className="context-info">
          <p className="text-body text-center">
            พิจารณาจากการตอบคำถามและกิจกรรมต่างๆ ที่ผ่านมา
          </p>
        </div>

        {/* Answer Section - Choice buttons */}
        <div className="answer-section">
          <div className="space-y-4">
            <button 
              className="btn btn-primary text-left"
              onClick={() => handleChoice('satisfied')}
              aria-describedby="satisfied-description"
            >
              <span className="mr-3" role="img" aria-label="พอใจ">😊</span>
              พอใจ
            </button>
            <div id="satisfied-description" className="sr-only">
              พอใจกับผลลัพธ์ที่ได้จากการตอบคำถาม
            </div>
            
            <button 
              className="btn btn-secondary text-left"
              onClick={() => handleChoice('unsatisfied')}
              aria-describedby="unsatisfied-description"
            >
              <span className="mr-3" role="img" aria-label="ไม่พอใจ">😕</span>
              ไม่พอใจ
            </button>
            <div id="unsatisfied-description" className="sr-only">
              ไม่พอใจกับผลลัพธ์และต้องการให้ข้อเสนอแนะ
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 1 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 2 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 3 เสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="ขั้นตอนที่ 4 กำลังดำเนินการ"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 5"></div>
          </div>
          <p className="text-caption">ขั้นตอนที่ 4 จาก 5</p>
        </div>

        {/* Additional guidance */}
        <div className="status-message info">
          คำตอบของคุณจะช่วยให้เราปรับปรุงนโยบายให้ดีขึ้น
        </div>
      </div>
    </div>
  );
};

export default Ask04;
