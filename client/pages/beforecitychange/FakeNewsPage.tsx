/* Fake News Page - Media Literacy Test
 * Tests user's ability to identify fake news
 */

import FakeNewsTest from "../../components/games/FakeNewsTest";
import { useSession } from "../../hooks/useSession";
import { useEffect } from "react";

const FakeNewsPage = () => {
  const { sessionID, navigateToPage } = useSession();

  useEffect(() => {
    import("./SourceSelectionPage").catch(() => {});
    import("./EndSequencePage").catch(() => {});
  }, []);

  return <FakeNewsTest sessionID={sessionID} onNavigate={navigateToPage} />;
};

export default FakeNewsPage;
