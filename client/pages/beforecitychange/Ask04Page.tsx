/* Ask04 Page - Satisfaction Rating
 * User rates their satisfaction after mini-games (MN1/MN2 path)
 */

import Ask04 from "../../components/journey/Ask04";
import { useSession } from "../../hooks/useSession";

const Ask04Page = () => {
  const { sessionID, navigateToPage, userJourneyData } = useSession();

  return (
    <Ask04
      sessionID={sessionID}
      onNavigate={navigateToPage}
      journeyData={userJourneyData}
    />
  );
};

export default Ask04Page;
