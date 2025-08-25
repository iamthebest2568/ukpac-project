import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import DashboardIndex from "./pages/DashboardIndex";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Journey pages
import Ask01Page from "./pages/Ask01Page";
import Ask02Page from "./pages/Ask02Page";
import Ask02_2Page from "./pages/Ask02_2Page";
import Ask04Page from "./pages/Ask04Page";
import Ask04BudgetPage from "./pages/Ask04BudgetPage";
import Ask05Page from "./pages/Ask05Page";

// Mini-game pages
import MiniGameMN1Page from "./pages/MiniGameMN1Page";
import MiniGameMN2Page from "./pages/MiniGameMN2Page";
import MiniGameMN3Page from "./pages/MiniGameMN3Page";

// Other journey pages
import EndSequencePage from "./pages/EndSequencePage";
import FakeNewsPage from "./pages/FakeNewsPage";
import SourceSelectionPage from "./pages/SourceSelectionPage";
import BudgetPage from "./pages/BudgetPage";
import EndScreenPage from "./pages/EndScreenPage";

// Dashboard
import DashboardApp from "./components/dashboard/DashboardApp";

const queryClient = new QueryClient();

// Layout component with accessibility features
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">
    <a
      href="#main-content"
      className="skip-link"
      aria-label="ข้ามไปยังเนื้อหาหลัก"
    >
      ข้ามไปยังเนื้อหาหลัก
    </a>
    <main id="main-content" role="main">
      {children}
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Main pages */}
            <Route path="/" element={<DashboardIndex />} />
            <Route path="/index" element={<Index />} />
            
            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardApp />} />
            
            {/* Survey journey pages */}
            <Route path="/ask01" element={<Ask01Page />} />
            <Route path="/ask02" element={<Ask02Page />} />
            <Route path="/ask02-2" element={<Ask02_2Page />} />
            <Route path="/ask04" element={<Ask04Page />} />
            <Route path="/ask04-budget" element={<Ask04BudgetPage />} />
            <Route path="/ask05" element={<Ask05Page />} />

            {/* Builder.io Design mode compatible routes (match component names) */}
            <Route path="/Ask01Page" element={<Ask01Page />} />
            <Route path="/Ask02Page" element={<Ask02Page />} />
            <Route path="/Ask02_2Page" element={<Ask02_2Page />} />
            <Route path="/Ask04Page" element={<Ask04Page />} />
            <Route path="/Ask04BudgetPage" element={<Ask04BudgetPage />} />
            <Route path="/Ask05Page" element={<Ask05Page />} />

            {/* Mini-game pages */}
            <Route path="/minigame-mn1" element={<MiniGameMN1Page />} />
            <Route path="/minigame-mn2" element={<MiniGameMN2Page />} />
            <Route path="/minigame-mn3" element={<MiniGameMN3Page />} />

            {/* Builder.io Design mode compatible routes for mini-games */}
            <Route path="/MiniGameMN1Page" element={<MiniGameMN1Page />} />
            <Route path="/MiniGameMN2Page" element={<MiniGameMN2Page />} />
            <Route path="/MiniGameMN3Page" element={<MiniGameMN3Page />} />
            
            {/* Other journey pages */}
            <Route path="/source-selection" element={<SourceSelectionPage />} />
            <Route path="/fake-news" element={<FakeNewsPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/end-sequence" element={<EndSequencePage />} />
            <Route path="/end-screen" element={<EndScreenPage />} />
            
            {/* Legacy support - redirect old gameID URLs to new routes */}
            <Route path="/legacy" element={<LegacyRedirectHandler />} />
            
            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Component to handle legacy gameID redirects
const LegacyRedirectHandler = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const gameID = searchParams.get('gameID');
  
  const redirectMap: Record<string, string> = {
    'ask01': '/ask01',
    'ask02': '/ask02',
    'ask02_2': '/ask02-2',
    'ask04': '/ask04',
    'ask04_budget': '/ask04-budget',
    'ask05': '/ask05',
    'Flow_MiniGame_MN1': '/minigame-mn1',
    'Flow_MiniGame_MN2': '/minigame-mn2',
    'Flow_MiniGame_MN3': '/minigame-mn3',
    'Flow_EndSequence': '/end-sequence',
    'fakeNews': '/fake-news',
    'sourceSelection': '/source-selection',
    'budget': '/budget',
    'endScreen': '/end-screen',
    'dashboard': '/dashboard',
    'index': '/',
    'dashboardIndex': '/'
  };
  
  if (gameID && redirectMap[gameID]) {
    // Preserve sessionID in redirect
    const sessionID = searchParams.get('sessionID');
    const newPath = redirectMap[gameID];
    const newUrl = sessionID ? `${newPath}?sessionID=${sessionID}` : newPath;
    window.location.replace(newUrl);
    return <div>Redirecting...</div>;
  }
  
  // If no valid gameID, redirect to home
  window.location.replace('/');
  return <div>Redirecting to home...</div>;
};

createRoot(document.getElementById("root")!).render(<App />);

export default App;
