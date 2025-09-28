/* End Screen Page - Thank You Screen
 * Final thank you screen for completing the journey
 */

import EndScreen from "../../components/games/ThankYouScreen";
import { useSession } from "../../hooks/useSession";

const EndScreenPage = () => {
  const { sessionID, navigateToPage, userJourneyData } = useSession();

  return (
    <EndScreen
      sessionID={sessionID}
      onNavigate={navigateToPage}
      journeyData={userJourneyData}
    />
  );
};

export default EndScreenPage;
