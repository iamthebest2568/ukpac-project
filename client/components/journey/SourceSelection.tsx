import { logEvent } from '../../services/dataLogger.js';
import FigmaStyle1Layout from '../layouts/FigmaStyle1Layout';

interface SourceSelectionProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const SourceSelection = ({ sessionID, onNavigate }: SourceSelectionProps) => {
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

  const handleReplay = () => {
    // Log replay action
    logEvent({
      event: 'SOURCE_SELECTION_REPLAY',
      payload: {
        sessionID
      }
    });
    
    // Could potentially navigate back or replay video content
    // For now, just log the action
    console.log('Replay button clicked');
  };

  // Define buttons for the FigmaStyle1Layout - exactly matching Figma design
  const buttons = [
    {
      text: "ช่องข่าว",
      onClick: () => handleSourceChoice('news_channel', 'ช่องข่าว'),
      ariaLabel: "เลือกช่องข่าว"
    },
    {
      text: "ข้อมูลจากสนข.",
      onClick: () => handleSourceChoice('government_data', 'ข้อมูลจากสนข.'),
      ariaLabel: "เลือกข้อมูลจากสำนักงานคณะกรรมการกำกับการขนส่งทางบก"
    },
    {
      text: "ป้ายประกาศข้างทาง",
      onClick: () => handleSourceChoice('road_signs', 'ป้ายประกาศข้างทาง'),
      ariaLabel: "เลือกป้ายประกาศข้างทาง"
    },
    {
      text: "Youtube",
      onClick: () => handleSourceChoice('youtube', 'Youtube'),
      ariaLabel: "เลือก Youtube"
    }
  ];

  const replayButton = {
    onClick: handleReplay,
    ariaLabel: "ดูอีกครั้ง"
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Feb2f14480a1349a6bc6b76594e26c7b5?format=webp&width=2160"
      backgroundAlt="รถไฟใต้ดินและป้ายข่าว"
      title="คุณจะติดตามข่าว หรือ เชื่อจากแหล่งข่าวไหน"
      buttons={buttons}
      className="source-selection-page"
    />
  );
};

export default SourceSelection;
