/**
 * End Sequence Page - Final Steps
 * Handles reward decision and final thank you
 */

import Flow_EndSequence from '../components/flows/Flow_EndSequence';
import { useSession } from '../hooks/useSession';
import { useFlowNavigation } from '../hooks/useFlowNavigation';

const EndSequencePage = () => {
  const { sessionID, navigateToPage } = useSession();
  const { handleEndSequenceComplete } = useFlowNavigation();

  return (
    <Flow_EndSequence
      sessionID={sessionID}
      onComplete={handleEndSequenceComplete}
      onBack={() => navigateToPage('/fake-news')}
    />
  );
};

export default EndSequencePage;
