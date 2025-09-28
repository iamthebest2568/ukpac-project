/* MiniGame MN2 Page - Beneficiary Groups */

import Flow_MiniGame_MN2 from "../components/flows/Flow_MiniGame_MN2";
import { useSession } from "../hooks/useSession";
import { useFlowNavigation } from "../hooks/useFlowNavigation";
import { useEffect } from "react";

const MiniGameMN2Page = () => {
  const { sessionID, navigateToPage, flowData } = useSession();
  const { handleMN2Complete } = useFlowNavigation();

  useEffect(() => {
    import("./MiniGameMN3Page").catch(() => {});
  }, []);

  return (
    <Flow_MiniGame_MN2
      sessionID={sessionID}
      onComplete={handleMN2Complete}
      onBack={() => navigateToPage("/minigame-mn1")}
      mn1Data={flowData.mn1}
    />
  );
};

export default MiniGameMN2Page;
