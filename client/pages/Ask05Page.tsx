/**
 * Ask05 Page - User Suggestions
 * User provides suggestions for improvement
 */

import Ask05 from '../components/journey/Ask05';
import { useSession } from '../hooks/useSession';

const Ask05Page = () => {
  const { sessionID, navigateToPage } = useSession();

  return (
    <Ask05 
      sessionID={sessionID} 
      onNavigate={navigateToPage} 
    />
  );
};

export default Ask05Page;
