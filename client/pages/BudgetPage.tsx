import BudgetAllocation from "../components/games/BudgetAllocation";
import { useSession } from "../hooks/useSession";
import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";

const BudgetPage = () => {
  const { sessionID, navigateToPage, userJourneyData } = useSession();

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F860ef7d79d0449bb9545aefbe3326e2e?format=webp&width=800"
      className="budget-page"
    >
      <BudgetAllocation
        sessionID={sessionID}
        onNavigate={navigateToPage}
        journeyData={userJourneyData}
      />
    </FigmaStyle1Layout>
  );
};

export default BudgetPage;
