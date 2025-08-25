/**
 * Fake News Page - Media Literacy Test
 * Tests user's ability to identify fake news
 */

import FakeNewsTest from "../components/games/FakeNewsTest";
import { useSession } from "../hooks/useSession";

const FakeNewsPage = () => {
  const { sessionID, navigateToPage } = useSession();

  return <FakeNewsTest sessionID={sessionID} onNavigate={navigateToPage} />;
};

export default FakeNewsPage;
