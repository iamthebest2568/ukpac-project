/**
 * Budget Page - Legacy Budget Allocation
 * Legacy budget allocation component (still needed for some paths)
 */

import BudgetAllocation from "../components/games/BudgetAllocation";
import { useSession } from "../hooks/useSession";

const BudgetPage = () => {
  const { sessionID, navigateToPage } = useSession();

  return <BudgetAllocation sessionID={sessionID} onNavigate={navigateToPage} />;
};

export default BudgetPage;
