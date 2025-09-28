/* MiniGame MN01 Page - Budget Allocation (cloned from MN3 page) */

import Flow_MiniGame_MN01 from "../../components/flows/Flow_MiniGame_MN01";
import { useSession } from "../../hooks/useSession";
import { useFlowNavigation } from "../hooks/useFlowNavigation";
import { useEffect } from "react";

const MiniGameMN01Page = () => {
  const { sessionID, navigateToPage } = useSession();
  const { handleMN1Complete } = useFlowNavigation();

  useEffect(() => {
    import("./MiniGameMN2Page").catch(() => {});
  }, []);

  return (
    <Flow_MiniGame_MN01
      sessionID={sessionID}
      onComplete={handleMN1Complete}
      onBack={() => navigateToPage("/ask02")}
    />
  );
};

export default MiniGameMN01Page;
