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

  // Define buttons for the FigmaStyle1Layout
  const buttons = [
    {
      text: "ข้อมูลจาก สนข.",
      onClick: () => handleSourceChoice('government_data', 'ข้อมูลจาก สนข.'),
      ariaLabel: "เลือกข้อมูลจากสำนักงานคณะกรรมการกำกับการขนส่งทางบก"
    },
    {
      text: "ป้ายประกาศข้างทาง",
      onClick: () => handleSourceChoice('road_signs', 'ป้ายประกาศข้างทาง'),
      ariaLabel: "เลือกป้ายประกาศข้างทาง"
    },
    {
      text: "อื่นๆ",
      onClick: () => handleSourceChoice('other', 'อื่นๆ'),
      ariaLabel: "เลือกแหล่งข้อมูลอื่นๆ"
    }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
      backgroundAlt="เลือกแหล่งข่าวที่เชื่อถือได้"
      title="คุณจะติดตามข่าว หรือเชื่อจากแหล่งข่าวไหน"
      buttons={buttons}
    />
  );
};

export default SourceSelection;
