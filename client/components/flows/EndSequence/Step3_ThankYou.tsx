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
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: 'ร่วมพัฒนาเมืองไทยให้ดีขึ้น - แบบสำรวจเชิงโต้ตอบ',
        text: 'มาร่วมแสดงความคิดเห็นเกี่ยวกับนโยบายการพัฒนาเมืองกับเราด้วย! ใช้เวลาแค่ 3-5 นาที',
        url: window.location.origin
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.origin);
      alert('ลิงก์ถูกคัดลอกแล้ว! แชร์ให้เพื่อนได้เลย');
    }
  };

  const handleFinish = () => {
    // Complete the journey and return to index
    const data = { journeyCompleted: true, completedAt: new Date().toISOString() };
    onNext(data);
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
            ขอบคุณที่ร่วมพัฒนาเมืองไทย
          </h1>
        </div>

        {/* Message content */}
        <div className="context-info">
          <div className="text-center space-y-4">
            <p className="text-body text-black">
              ความค���ดเห็นของคุณจะถูกนำไปใช้ในการพัฒนานโยบายสาธารณะให้ดีขึ้น
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-body font-bold text-green-800 mb-2">สิ่งที่เกิดขึ้นต่อไป:</h3>
              <ul className="text-caption text-green-700 space-y-1 text-left">
                <li>• ข้อมูลจะถูกวิเคราะห์อย่างละเอียด</li>
                <li>• ผลการศึกษาจะถูกนำเสนอต่อหน่วยงานที่เกี่ยวข้อง</li>
                <li>• คุณจะได้รับข่าวสารผลการศึกษา (หากระบุอีเมล)</li>
                <li>• เราจะมีโครงการสำรวจใหม่ในอนาคต</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="answer-section">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-body font-bold text-blue-800 mb-4">สถิติการมีส่วนร่วม</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">5 นาที</div>
                <div className="text-caption text-blue-700">เวลาที่คุณใช้</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-caption text-blue-700">ความสมบูรณ์</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="completion-zone">
          <div className="space-y-4">
            <button 
              className="btn btn-primary"
              onClick={handleShare}
            >
              <span className="mr-2" role="img" aria-label="แชร์">📤</span>
              แชร์ให้เพื่อน
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={handleFinish}
            >
              เสร็จสิ้น
            </button>
          </div>
        </div>

        {/* Final message */}
        <div className="status-message success">
          <strong>ภารกิจสำเร็จ!</strong> คุณได้ช่วยทำให้เมืองไทยดีขึ้นแล้ว 🇹🇭
        </div>
      </div>
    </div>
  );
};

export default Step3_ThankYou;
