/**
 * Ask02_2 Page - Custom Reasoning
 * User provides custom reasoning if they selected "Other"
 */

import Ask02_2 from "../components/journey/Ask02_2";
import { useSession } from "../hooks/useSession";
import { useEffect } from "react";

const Ask02_2Page = () => {
  const { sessionID, navigateToPage } = useSession();

  useEffect(() => {
    import("./Ask05Page").catch(() => {});
  }, []);

  return <Ask02_2 sessionID={sessionID} onNavigate={navigateToPage} />;
};

export default Ask02_2Page;
