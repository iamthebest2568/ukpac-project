import { useSession } from "../../hooks/useSession";
import { useSession } from "../../hooks/useSession";
import BudgetAllocation from "../../components/games/BudgetAllocation";

const Ukpack1BudgetPage = () => {
  const { sessionID, navigateToPage } = useSession();

  // Render BudgetAllocation in compact layoutMode so it displays well without Figma wrapper
  return (
    <BudgetAllocation sessionID={sessionID} onNavigate={navigateToPage} layoutMode={true} />
  );
};

export default Ukpack1BudgetPage;
