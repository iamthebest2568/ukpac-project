/**
 * MiniGame MN3 Page - Budget Allocation
 * Third mini-game for budget allocation
 */

import Flow_MiniGame_MN3 from "../components/flows/Flow_MiniGame_MN3";
import { useSession } from "../hooks/useSession";
import { useFlowNavigation } from "../hooks/useFlowNavigation";
import { useEffect } from "react";

const MiniGameMN3Page = () => {
  const { sessionID, navigateToPage } = useSession();
  const { handleMN3Complete } = useFlowNavigation();

  useEffect(() => {
    import("./Ask04BudgetPage").catch(() => {});
  }, []);

  return (
    <Flow_MiniGame_MN3
      sessionID={sessionID}
      onComplete={handleMN3Complete}
      onBack={() => navigateToPage("/ask02")}
    />
  );
};

export default MiniGameMN3Page;
