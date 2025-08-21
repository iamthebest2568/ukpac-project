interface SourceSelectionProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const SourceSelection = ({ sessionID, onNavigate }: SourceSelectionProps) => {
  const newsSources = [
    { id: 'tv_news', label: 'ช่องข่าว', icon: '📺', description: 'ข่าวจากสถานีโทรทัศน์' },
    { id: 'government_data', label: 'ข้อมูลจากสนข.', icon: '🏛️', description: 'ข้อมูลจากสำนักงานคณะกรรมการกำกับการขนส่งทางบก' },
    { id: 'road_signs', label: 'ป้ายประกาศข้างทาง', icon: '🚧', description: 'ป้ายประกาศและแผ่นพับจาก���น่วยงานรัฐ' },
    { id: 'social_media', label: 'โซเชียลมีเดีย', icon: '📱', description: 'ข้อมูลจากเฟซบุ๊ก ไลน์ และแอปพลิเคชัน' },
    { id: 'news_websites', label: 'เว็บไซต์ข่าว', icon: '💻', description: 'พอร์ทัลข่าวออนไลน์และสื่อดิจิทัล' }
  ];

  const handleSourceChoice = (sourceId: string, sourceLabel: string) => {
    const data = { source: sourceId, sourceLabel };
    
    // Log the choice to console as requested
    console.log({ 
      sessionID,
      game: 'sourceSelection', 
      data: { source: sourceLabel } 
    });
    
    // Navigate to reward decision screen
    onNavigate('rewardDecision', data);
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2">
            คุณจะติดตามข่าว หรือเชื่อจากแหล่งข่าวไหน
          </h1>
        </div>

        {/* Context information */}
        <div className="context-info">
          <p className="text-body text-center">
            เลือกแหล่งข้อมูลที่คุณไว้วางใจที่สุดสำหรับการติดตามข่าวสารเกี่ยวกับนโยบายนี้
          </p>
        </div>

        {/* Answer Section - News Source Options */}
        <div className="answer-section">
          <div className="space-y-4">
            {newsSources.map((source) => (
              <button
                key={source.id}
                className="btn btn-primary text-left p-4 h-auto"
                onClick={() => handleSourceChoice(source.id, source.label)}
                aria-describedby={`source-${source.id}-description`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-4" role="img" aria-label={source.description}>
                    {source.icon}
                  </span>
                  <div className="flex-1 text-left">
                    <div className="text-body font-bold text-black">
                      {source.label}
                    </div>
                    <div 
                      id={`source-${source.id}-description`}
                      className="text-caption text-gray-600 mt-1"
                    >
                      {source.description}
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img" aria-label="เลือก">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Information about media literacy */}
        <div className="status-message info">
          <strong>💡 คำแนะนำ:</strong> การตรวจสอบข้อมูลจากหลายแหล่งที่น่าเชื่อถือจะช่วยให้เราได้ข้อมูลที่ถูกต้องและครบถ้วน
        </div>

        {/* Progress indicator - Final steps */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="เริ่มต้นเสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ตรวจสอบข้อมูลเสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="เลือกแหล่งข่าว กำลังดำเนินการ"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนสุดท้าย"></div>
          </div>
          <p className="text-caption">เลือกแหล่งข่าวที่เชื่อถือได้</p>
        </div>
      </div>
    </div>
  );
};

export default SourceSelection;
