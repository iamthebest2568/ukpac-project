/**
 * Ask01 Page - Initial Policy Stance
 * First question asking user's initial opinion on the policy
 */

import Ask01 from "../components/journey/Ask01";
import { useSession } from "../hooks/useSession";
import { useEffect } from "react";

const Ask01Page = () => {
  const { sessionID, navigateToPage } = useSession();

  useEffect(() => {
    import("./Ask02Page").catch(() => {});
    import("./FakeNewsPage").catch(() => {});
  }, []);

  return <Ask01 sessionID={sessionID} onNavigate={navigateToPage} />;
};

export default Ask01Page;
