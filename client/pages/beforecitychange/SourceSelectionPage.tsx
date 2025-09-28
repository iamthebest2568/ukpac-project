/* Source Selection Page - Information Source
 * User selects their preferred information source
 */

import SourceSelection from "../components/journey/SourceSelection";
import { useSession } from "../hooks/useSession";
import { useEffect } from "react";

const SourceSelectionPage = () => {
  const { sessionID, navigateToPage } = useSession();

  useEffect(() => {
    import("./EndSequencePage").catch(() => {});
  }, []);

  return <SourceSelection sessionID={sessionID} onNavigate={navigateToPage} />;
};

export default SourceSelectionPage;
