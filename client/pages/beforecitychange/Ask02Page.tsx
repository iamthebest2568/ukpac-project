/* Ask02 Page - Reasoning Selection
 * User selects their reasoning for their initial stance
 */

import Ask02 from "../../components/journey/Ask02";
import { useSession } from "../hooks/useSession";
import { useEffect } from "react";

const Ask02Page = () => {
  const { sessionID, navigateToPage } = useSession();

  useEffect(() => {
    import("./MiniGameMN1Page").catch(() => {});
    import("./MiniGameMN3Page").catch(() => {});
    import("./Ask02_2Page").catch(() => {});
  }, []);

  return <Ask02 sessionID={sessionID} onNavigate={navigateToPage} />;
};

export default Ask02Page;
