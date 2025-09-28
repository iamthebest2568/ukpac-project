/* MiniGame MN1 Page - Policy Priorities */

import Flow_MiniGame_MN1 from "../components/flows/Flow_MiniGame_MN1";
import { useSession } from "../hooks/useSession";
import { useFlowNavigation } from "../hooks/useFlowNavigation";
import { useEffect } from "react";

const MiniGameMN1Page = () => {
  const { sessionID, navigateToPage } = useSession();
  const { handleMN1Complete } = useFlowNavigation();

  useEffect(() => {
    import("./MiniGameMN2Page").catch(() => {});
  }, []);

  return (
    <Flow_MiniGame_MN1
      sessionID={sessionID}
      onComplete={handleMN1Complete}
      onBack={() => navigateToPage("/ask02")}
    />
  );
};

export default MiniGameMN1Page;
