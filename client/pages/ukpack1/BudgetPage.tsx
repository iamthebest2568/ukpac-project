import { useSession } from "../../hooks/useSession";
import BudgetAllocation from "../../components/games/BudgetAllocation";

const Ukpack1BudgetPage = () => {
  const { sessionID, navigateToPage } = useSession();

  // Render BudgetAllocation without FigmaStyle1Layout for ukpack1/budget
  return (
    <BudgetAllocation sessionID={sessionID} onNavigate={navigateToPage} />
  );
};

export default Ukpack1BudgetPage;
