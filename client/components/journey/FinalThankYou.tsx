interface FinalThankYouProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const FinalThankYou = ({ sessionID, onNavigate }: FinalThankYouProps) => {
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
    // Navigate back to index or could close the app
    onNavigate('index');
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Success celebration */}
        <div className="text-center mb-8">
          <div className="relative">
            {/* Main celebration icon */}
            <div className="text-8xl mb-4" role="img" aria-label="เสร็จสิ้น">🎉</div>
            
            {/* Floating celebration elements */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-4">
                <div className="text-2xl animate-bounce" role="img" aria-label="ดาว">⭐</div>
                <div className="text-2xl animate-bounce" style={{animationDelay: '0.5s'}} role="img" aria-label="ประกาย">✨</div>
                <div className="text-2xl animate-bounce" style={{animationDelay: '1s'}} role="img" aria-label="ฉลอง">🎊</div>
              </div>
            </div>
          </div>
          
          <h1 className="text-h1 mb-6">
            ขอบคุณที่ร่วมกิจกรรม
          </h1>
          
          <div className="context-info bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-success">
            <p className="text-body text-text-primary leading-relaxed">
              เราจะประกาศรายชื่อผู้โชคดี<br />
              <strong className="text-primary-action">วันที่ 31 มีนาคม 2567</strong><br />
              ทางเว็บไซต์และโซเชียลมีเดียของเรา
            </p>
          </div>
        </div>

        {/* Summary of participation */}
        <div className="context-info">
          <h3 className="text-body font-bold text-text-primary mb-3">🏆 สิ่งที่คุณได้ทำเสร็จแล้ว</h3>
          <div className="space-y-2">
            <div className="flex items-center text-caption text-text-secondary">
              <span className="mr-2 text-success">✅</span>
              <span>แสดงความคิดเห็นต่อนโยบายการพัฒนาเมือง</span>
            </div>
            <div className="flex items-center text-caption text-text-secondary">
              <span className="mr-2 text-success">✅</span>
              <span>ช่วยตรวจสอบข้อมูลข่าวสารที่ถูกต้อง</span>
            </div>
            <div className="flex items-center text-caption text-text-secondary">
              <span className="mr-2 text-success">✅</span>
              <span>เลือกแหล่งข้อมูลที่เชื่อถือได้</span>
            </div>
            <div className="flex items-center text-caption text-text-secondary">
              <span className="mr-2 text-success">✅</span>
              <span>ร่วมเป็นส่วนหนึ่งในการพัฒนาเมืองไทย</span>
            </div>
          </div>
        </div>

        {/* Follow-up information */}
        <div className="status-message info">
          <strong>📢 การติดตาม:</strong> คุณสามารถติดตามข่าวสารและผลการจับรางวัลได้ที่เว็บไซต์ของเรา
        </div>

        {/* Action buttons */}
        <div className="answer-section">
          <div className="space-y-4">
            <button 
              className="btn btn-primary"
              onClick={handleShare}
              aria-describedby="share-description"
            >
              <span className="mr-3" role="img" aria-label="แชร์">📱</span>
              แชร์เกมนี้ให้เพื่อน
            </button>
            <div id="share-description" className="sr-only">
              แชร์แบบสำรวจนี้ให้เพื่อนๆ ได้ร่วมแสดงความคิดเห็น
            </div>
            
            <button 
              className="btn btn-secondary"
              onClick={handleFinish}
              aria-describedby="finish-description"
            >
              <span className="mr-3" role="img" aria-label="จบ">🏁</span>
              จบเกม
            </button>
            <div id="finish-description" className="sr-only">
              จบการสำรวจและกลับสู่หน้าหลัก
            </div>
          </div>
        </div>

        {/* Social media and contact info */}
        <div className="mt-8 text-center">
          <div className="context-info">
            <h4 className="text-body font-bold text-text-primary mb-3">📞 ติดต่อเรา</h4>
            <div className="flex justify-center space-x-6 text-caption text-text-secondary">
              <div className="flex items-center">
                <span className="mr-1" role="img" aria-label="เว็บไซต์">🌐</span>
                <span>เว็บไซต์หลัก</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1" role="img" aria-label="เฟซบุ๊ก">📘</span>
                <span>Facebook</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1" role="img" aria-label="ไลน์">💚</span>
                <span>LINE Official</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final progress indicator - completed */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="การสำรวจเสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="กิจกรรมเสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ข้อมูลเสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="เสร็จสิ้นทั้งหมด"></div>
          </div>
          <p className="text-caption">เสร็จสิ้นแล้ว - ขอบคุณที่ร่วมกิจกรรม!</p>
        </div>

        {/* Session info for development */}
        {sessionID && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center text-micro text-text-secondary">
            Session: {sessionID}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalThankYou;
