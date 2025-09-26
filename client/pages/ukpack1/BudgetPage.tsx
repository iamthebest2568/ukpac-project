import { useSession } from "../../hooks/useSession";
import BudgetAllocation from "../../components/games/BudgetAllocation";
import FigmaStyle1Layout from "../../components/layouts/FigmaStyle1Layout";
import TabletMockup from "./components/TabletMockup";

const Ukpack1BudgetPage = () => {
  const { sessionID, navigateToPage } = useSession();

  // Use the FigmaStyle1Layout wrapper for consistent figma styling
  return (
    <TabletMockup>
      <FigmaStyle1Layout
        backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F860ef7d79d0449bb9545aefbe3326e2e?format=webp&width=800"
        className="budget-page"
        imageLoading="eager"
      >
        <BudgetAllocation
          sessionID={sessionID}
          onNavigate={navigateToPage}
          layoutMode={true}
        />
      </FigmaStyle1Layout>
    </TabletMockup>
  );
};

export default Ukpack1BudgetPage;
