/**
 * UK PACK - End Sequence Step 3: Thank You
 * Moved from FinalThankYou component
 */

interface Step3_ThankYouProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  journeyData?: any;
}

const Step3_ThankYou = ({ sessionID, onNext, onBack, journeyData }: Step3_ThankYouProps) => {
  const handleShare = () => {
    // Share functionality - non-functional as per flowchart but completes the flow
    console.log('Share button clicked - completing flow');
    onNext({ action: 'shared', completedAt: new Date().toISOString() });
  };

  const handleFinish = () => {
    // Finish game - non-functional as per flowchart but completes the flow
    console.log('Finish game clicked - completing flow');
    onNext({ action: 'finished', completedAt: new Date().toISOString() });
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Success celebration */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-48 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg relative overflow-hidden">
            {/* Celebration elements */}
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-3" role="img" aria-label="ขอบคุณ">🎉</div>
              <div className="text-h3 text-black font-bold mb-2">ขอบคุณมากครับ!</div>
              <div className="text-body text-gray-600">การมีส่วนร่วมของคุณมีความหมายมาก</div>
            </div>

            {/* Decorative celebration elements */}
            <div className="absolute top-4 left-4 text-2xl animate-bounce" role="img" aria-label="ดาว">⭐</div>
            <div className="absolute top-6 right-6 text-xl animate-pulse" role="img" aria-label="หัวใจ">💖</div>
            <div className="absolute bottom-4 left-6 text-lg animate-bounce" role="img" aria-label="ดาว">🌟</div>
            <div className="absolute bottom-4 right-4 text-2xl animate-pulse" role="img" aria-label="เพชร">💎</div>
            <div className="absolute top-1/2 left-1/4 text-lg animate-bounce" role="img" aria-label="ปรบมือ">👏</div>
            <div className="absolute top-1/3 right-1/4 text-lg animate-pulse" role="img" aria-label="ยิ้ม">😊</div>
          </div>
        </div>

        {/* Thank you message */}
        <div className="question-section">
          <h1 className="text-h2 text-center text-black">
            ขอบคุณที่ร่วมกิจกรรม เราจะประกาศรายชื่อผู้โชคดีวันที่ XXXXXX
          </h1>
        </div>

        {/* Action buttons */}
        <div className="completion-zone">
          <div className="space-y-4">
            <button 
              className="btn btn-primary"
              onClick={handleShare}
            >
              <span className="mr-2" role="img" aria-label="แชร์">📤</span>
              แชร์เกมนี้ให้เพื่อน
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={handleFinish}
            >
              จบเกม
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3_ThankYou;
