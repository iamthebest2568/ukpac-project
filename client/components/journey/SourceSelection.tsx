import { logEvent } from '../../services/dataLogger.js';
import FigmaStyle1Layout from '../layouts/FigmaStyle1Layout';

interface SourceSelectionProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const SourceSelection = ({ sessionID, onNavigate }: SourceSelectionProps) => {
  const newsSources = [
    { id: 'government_data', label: 'ข้อมูลจาก สนข.', icon: '🏛️', description: 'ข้อมูลจากสำนักงานคณะกรรมการกำกับการขนส่งทางบก' },
    { id: 'road_signs', label: 'ป้ายประกาศข้างทาง', icon: '🚧', description: 'ป้ายประกาศและแผ่นพับจากหน่วยงานรัฐ' },
    { id: 'other', label: 'อื่นๆ', icon: '📄', description: 'แหล่งข้อมูลอื่นๆ' }
  ];

  const handleSourceChoice = (sourceId: string, sourceLabel: string) => {
    const data = { source: sourceId, sourceLabel };

    // Log the source selection choice
    logEvent({
      event: 'SOURCE_SELECTION',
      payload: {
        source: sourceLabel,
        sourceId,
        sessionID
      }
    });

    // Navigate to Flow_EndSequence (reward decision flow)
    onNavigate('Flow_EndSequence', data);
  };

  // Create buttons for FigmaStyle1Layout
  const buttons = newsSources.map((source) => ({
    text: source.label,
    onClick: () => handleSourceChoice(source.id, source.label),
    ariaLabel: `เลือก${source.label} - ${source.description}`,
    icon: source.icon
  }));

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="เลือกแหล่งข่า���ที่เชื่อถือได้"
            className="w-full h-full object-cover object-center"
            style={{ minWidth: "100%", aspectRatio: "2/3" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 44.17%)",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Content Area */}
          <div className="flex-1 flex flex-col justify-end items-center px-6 md:px-8 pb-8 md:pb-12">
            {/* Title */}
            <div className="text-center mb-6 md:mb-8 max-w-[325px]">
              <h1
                className="text-white text-center font-kanit text-3xl font-normal leading-normal mb-4"
                style={{ fontSize: "clamp(24px, 7.5vw, 30px)" }}
              >
                คุณจะติดตามข่าว หรือเชื่อจากแหล่งข่าวไหน
              </h1>
              <p className="text-white text-center font-prompt text-base leading-relaxed">
                เลือกแหล่งข้อมูลที่คุณไว้วา��ใจที่สุดสำหรับการติดตามข่าวสารเกี่ยวกับนโยบายนี้
              </p>
            </div>

            {/* Source Selection Buttons */}
            <div className="w-full max-w-[325px] space-y-4 mb-6">
              {newsSources.map((source) => (
                <button
                  key={source.id}
                  className="w-full rounded-[20px] bg-white border-[1.5px] border-black p-4 transition-all duration-200 hover:bg-[#EFBA31] hover:scale-105 active:bg-[#EFBA31] group"
                  onClick={() => handleSourceChoice(source.id, source.label)}
                  aria-describedby={`source-${source.id}-description`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-4" role="img" aria-label={source.description}>
                      {source.icon}
                    </span>
                    <div className="flex-1 text-left">
                      <div className="font-prompt text-base font-medium text-black group-hover:text-black">
                        {source.label}
                      </div>
                      <div 
                        id={`source-${source.id}-description`}
                        className="font-prompt text-sm text-gray-600 mt-1 group-hover:text-gray-700"
                      >
                        {source.description}
                      </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-black">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img" aria-label="เลือก">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Information about media literacy */}
            <div className="w-full max-w-[325px] mb-4 bg-blue-500 bg-opacity-90 rounded-[15px] p-3">
              <div className="text-white text-center text-sm font-prompt">
                <strong>💡 คำแนะนำ:</strong> การตรวจสอบข้อมูลจากหลายแหล่งที่น่าเชื่อถือจะช่วยให้เราได้ข้อมูลที่ถูกต้องและครบถ้วน
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceSelection;
