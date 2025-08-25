/**
 * Ask02 Page - Reasoning Selection
 * User selects their reasoning for their initial stance
 */

import Ask02 from '../components/journey/Ask02';
import { useSession } from '../hooks/useSession';

const Ask02Page = () => {
  const { sessionID, navigateToPage } = useSession();

  return (
    <Ask02 
      sessionID={sessionID} 
      onNavigate={navigateToPage} 
    />
  );
};

export default Ask02Page;
