/* End Sequence Page - Final Steps
 * Handles reward decision and final thank you
 */

import Flow_EndSequence from "../../components/flows/Flow_EndSequence";
import { useSession } from "../../hooks/useSession";
import { useFlowNavigation } from "../../hooks/useFlowNavigation";
import { useEffect } from "react";

const EndSequencePage = () => {
  const { sessionID, navigateToPage } = useSession();
  const { handleEndSequenceComplete } = useFlowNavigation();

  useEffect(() => {
    const prefetch = () => import("./EndScreenPage").catch(() => {});
    if (typeof (window as any).requestIdleCallback === "function") {
      (window as any).requestIdleCallback(prefetch);
    } else {
      setTimeout(prefetch, 1500);
    }
  }, []);

  return (
    <Flow_EndSequence
      sessionID={sessionID}
      onComplete={handleEndSequenceComplete}
      onBack={() => navigateToPage("/fake-news")}
    />
  );
};

export default EndSequencePage;
