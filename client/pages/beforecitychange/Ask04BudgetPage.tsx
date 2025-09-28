/* Ask04Budget Page - Budget Satisfaction Rating
 * User rates their satisfaction after budget mini-game (MN3 path)
 */

import Ask04Budget from "../../components/journey/Ask04Budget";
import { useSession } from "../../hooks/useSession";

const Ask04BudgetPage = () => {
  const { sessionID, navigateToPage, userJourneyData } = useSession();

  const isUkpack1 =
    typeof window !== "undefined" &&
    window.location &&
    window.location.pathname.startsWith("/beforecitychange");

  return (
    <Ask04Budget
      sessionID={sessionID}
      onNavigate={navigateToPage}
      journeyData={userJourneyData}
      useUk1Button={isUkpack1}
    />
  );
};

export default Ask04BudgetPage;
