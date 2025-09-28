/* Ask05 Page - User Suggestions
 * User provides suggestions for improvement
 */

import Ask05 from "../../components/journey/Ask05";
import { useSession } from "../../hooks/useSession";

const Ask05Page = () => {
  const { sessionID, navigateToPage } = useSession();
  const isUkpack1 =
    typeof window !== "undefined" &&
    window.location &&
    window.location.pathname.startsWith("/beforecitychange");

  return (
    <Ask05
      sessionID={sessionID}
      onNavigate={navigateToPage}
      useUk1Button={isUkpack1}
    />
  );
};

export default Ask05Page;
