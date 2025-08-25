/**
 * MiniGame MN1 Page - Policy Priorities
 * First mini-game for policy priority selection
 */

import Flow_MiniGame_MN1 from '../components/flows/Flow_MiniGame_MN1';
import { useSession } from '../hooks/useSession';
import { useFlowNavigation } from '../hooks/useFlowNavigation';

const MiniGameMN1Page = () => {
  const { sessionID, navigateToPage } = useSession();
  const { handleMN1Complete } = useFlowNavigation();

  return (
    <Flow_MiniGame_MN1
      sessionID={sessionID}
      onComplete={handleMN1Complete}
      onBack={() => navigateToPage('/ask02')}
    />
  );
};

export default MiniGameMN1Page;
