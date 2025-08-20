interface EndScreenProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData: any;
}

const EndScreen = ({ sessionID, onNavigate, journeyData }: EndScreenProps) => {
  const handleReward = () => {
    console.log('Reward claimed', { sessionID, journeyData });
  };

  const handleDetails = () => {
    console.log('Details form requested', { sessionID, journeyData });
  };

  const handleShare = () => {
    console.log('Share with friends', { sessionID });
    if (navigator.share) {
      navigator.share({
        title: 'ร่วมพัฒนาเมืองไทยให้ดีขึ้น',
        text: 'มาร่วมแสดงความคิดเห็นเกี่ยวกับนโยบายการพัฒนาเมืองกับเราด้วย!',
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert('ลิงก์ถูกคัดลอกแล้ว!');
    }
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Final illustration - bright optimistic city */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-48 bg-gradient-to-t from-blue-100 via-green-100 to-yellow-100 rounded-lg relative overflow-hidden">
            {/* Success celebration background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-green-200 opacity-30"></div>
            
            {/* Celebratory elements */}
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-3" role="img" aria-label="ฉลอง">🎉</div>
              <div className="text-body font-bold text-text-primary mb-2">เสร็จสิ้น!</div>
              <div className="text-caption text-text-secondary">ขอบคุณสำหรับการมีส่วนร่วม</div>
            </div>

            {/* Floating celebration icons */}
            <div className="absolute top-4 left-4 text-2xl animate-bounce" role="img" aria-label="ดาว">⭐</div>
            <div className="absolute top-6 right-6 text-2xl animate-bounce" style={{animationDelay: '0.5s'}} role="img" aria-label="ฉลอง">🎊</div>
            <div className="absolute bottom-6 left-6 text-2xl animate-bounce" style={{animationDelay: '1s'}} role="img" aria-label="ดาว">🌟</div>
            <div className="absolute bottom-4 right-4 text-2xl animate-bounce" style={{animationDelay: '1.5s'}} role="img" aria-label="ประกาย">✨</div>

            {/* Modern city skyline */}
            <div className="absolute bottom-0 left-0 right-0 h-16">
              <div className="flex justify-center space-x-1 h-full items-end" role="img" aria-label="เมืองแห่งอนาคต">
                <div className="w-4 h-12 bg-blue-400 rounded-t-sm opacity-80"></div>
                <div className="w-3 h-10 bg-indigo-400 rounded-t-sm opacity-80"></div>
                <div className="w-5 h-14 bg-blue-500 rounded-t-sm opacity-80"></div>
                <div className="w-2 h-8 bg-sky-400 rounded-t-sm opacity-80"></div>
                <div className="w-4 h-11 bg-indigo-500 rounded-t-sm opacity-80"></div>
                <div className="w-3 h-9 bg-blue-400 rounded-t-sm opacity-80"></div>
                <div className="w-4 h-13 bg-sky-500 rounded-t-sm opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Thank you message */}
        <div className="question-section text-center">
          <h1 className="text-h1 mb-6">
            ขอบคุณ!
          </h1>
          
          <p className="text-body text-text-primary mb-4 leading-relaxed">
            ขอบคุณที่ร่วมเป็นส่วนหนึ่ง<br />
            ในการพัฒนาเมืองนี้ให้ดีขึ้น
          </p>

          <p className="text-body text-text-secondary leading-relaxed">
            ความคิดเห็นของคุณจะช่วยให้เราสร้างเมืองที่ดีขึ้นสำหรับทุกคน
          </p>
        </div>

        {/* Three action sections */}
        <div className="answer-section">
          <div className="space-y-4">
            {/* Reward Section */}
            <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-warning border-opacity-30">
              <div className="flex items-center mb-3">
                <div className="text-3xl mr-3" role="img" aria-label="รางวัล">🎁</div>
                <div className="flex-1">
                  <h3 className="text-body font-bold text-text-primary">ลุ้นรับรางวัล!</h3>
                  <p className="text-caption text-text-secondary">บัตรโดยสารมูลค่า 300 บาท</p>
                </div>
              </div>
              <button 
                className="btn btn-primary w-full"
                onClick={handleReward}
                aria-describedby="reward-description"
              >
                <span className="mr-2" role="img" aria-label="ลุ้น">🎲</span>
                เข้าร่วมการจับรางวัล
              </button>
              <div id="reward-description" className="sr-only">เข้าร่วมการจับรางวัลบัตรโดยสารมูลค่า 300 บาท</div>
            </div>

            {/* Details Section */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 border-opacity-50">
              <div className="flex items-center mb-3">
                <div className="text-3xl mr-3" role="img" aria-label="ข้อมูล">📝</div>
                <div className="flex-1">
                  <h3 className="text-body font-bold text-text-primary">ข้อมูลเพิ่มเติม</h3>
                  <p className="text-caption text-text-secondary">กรอกข้อมูลเพื่อรับข่าวสารและรางวัล</p>
                </div>
              </div>
              <button 
                className="btn btn-secondary w-full"
                onClick={handleDetails}
                aria-describedby="details-description"
              >
                <span className="mr-2" role="img" aria-label="กรอกข้อมูล">✍️</span>
                กรอกข้อมูล
              </button>
              <div id="details-description" className="sr-only">กรอกข้อมูลเพื่อรับข่าวสารและรางวัล</div>
            </div>

            {/* Share Section */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-2 border-success border-opacity-30">
              <div className="flex items-center mb-3">
                <div className="text-3xl mr-3" role="img" aria-label="แชร์">🤝</div>
                <div className="flex-1">
                  <h3 className="text-body font-bold text-text-primary">แชร์ชวนเพื่อน</h3>
                  <p className="text-caption text-text-secondary">ชวนเพื่อนมาร่วมพัฒนาเมืองด้วยกัน</p>
                </div>
              </div>
              <button 
                className="btn btn-secondary w-full"
                onClick={handleShare}
                aria-describedby="share-description"
              >
                <span className="mr-2" role="img" aria-label="แชร์">📱</span>
                แชร์เลย
              </button>
              <div id="share-description" className="sr-only">แชร์ลิงก์ให้เพื่อนร่วมแสดงความคิดเห็น</div>
            </div>
          </div>
        </div>

        {/* Journey summary */}
        <div className="context-info">
          <h4 className="text-body font-bold text-text-primary mb-3">สรุปการเดินทางของคุณ:</h4>
          <div className="text-caption text-text-secondary space-y-1">
            <div className="flex items-center">
              <span className="mr-2 text-success">✅</span>
              <p>ตอบคำถามเกี่ยวกับนโยบาย</p>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-success">✅</span>
              <p>ร่วมกิจกรรมเชิงโต้ตอบ</p>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-success">✅</span>
              <p>แสดงความคิดเห็นที่มีค่า</p>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-success">✅</span>
              <p>ช่วยพัฒนาเมืองไทย</p>
            </div>
          </div>
        </div>

        {/* Start over option */}
        <div className="completion-zone text-center">
          <button 
            className="btn btn-secondary text-sm max-w-xs"
            onClick={() => onNavigate('index')}
          >
            <span className="mr-2" role="img" aria-label="เริ่มใหม่">🔄</span>
            เริ่มต้นใหม่
          </button>
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

export default EndScreen;
