/**
 * Ask04Budget Page - Budget Satisfaction Rating
 * User rates their satisfaction after budget mini-game (MN3 path)
 */

import Ask04Budget from '../components/journey/Ask04Budget';
import { useSession } from '../hooks/useSession';

const Ask04BudgetPage = () => {
  const { sessionID, navigateToPage, userJourneyData } = useSession();

  return (
    <Ask04Budget 
      sessionID={sessionID} 
      onNavigate={navigateToPage}
      journeyData={userJourneyData}
    />
  );
};

export default Ask04BudgetPage;
