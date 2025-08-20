import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// Journey components
import IndexPage from "./components/journey/IndexPage";
import Ask01 from "./components/journey/Ask01";
import Ask02 from "./components/journey/Ask02";
import Ask02_2 from "./components/journey/Ask02_2";
import Ask04 from "./components/journey/Ask04";
import Ask05 from "./components/journey/Ask05";
import EndScreen from "./components/journey/EndScreen";

// Mini-game components (updated)
import PolicyPriorities from "./components/games/PolicyPriorities";
import BeneficiaryGroups from "./components/games/BeneficiaryGroups";
import BudgetAllocation from "./components/games/BudgetAllocation";
import FakeNewsTest from "./components/games/FakeNewsTest";

const queryClient = new QueryClient();

const JourneyRouter = () => {
  const [activeScreen, setActiveScreen] = useState<string | null>(null);
  const [sessionID, setSessionID] = useState<string | null>(null);
  const [userJourneyData, setUserJourneyData] = useState<any>({});

  useEffect(() => {
    // Parse URL query parameters on page load
    const urlParams = new URLSearchParams(window.location.search);
    const gameID = urlParams.get('gameID');
    const sessionIDParam = urlParams.get('sessionID');
    
    // Set sessionID
    setSessionID(sessionIDParam || `session_${Date.now()}`);
    
    // Set activeScreen - default to 'ask01' if no gameID provided
    setActiveScreen(gameID || 'index');
  }, []);

  // Function to navigate between screens
  const navigateToScreen = (screenId: string, data?: any) => {
    if (data) {
      setUserJourneyData(prev => ({ ...prev, [activeScreen || 'unknown']: data }));
      console.log('Journey Data Updated:', { screen: activeScreen, data, sessionID });
    }
    setActiveScreen(screenId);
    
    // Update URL without page reload
    const newUrl = `${window.location.pathname}?gameID=${screenId}${sessionID ? `&sessionID=${sessionID}` : ''}`;
    window.history.pushState({}, '', newUrl);
  };

  // Render appropriate component based on activeScreen state
  const renderJourneyComponent = () => {
    switch (activeScreen) {
      case 'index':
        return <IndexPage onNavigate={navigateToScreen} />;
      case 'ask01':
        return <Ask01 sessionID={sessionID} onNavigate={navigateToScreen} />;
      case 'ask02':
        return <Ask02 sessionID={sessionID} onNavigate={navigateToScreen} />;
      case 'ask02_2':
        return <Ask02_2 sessionID={sessionID} onNavigate={navigateToScreen} />;
      case 'priorities':
        return <PolicyPriorities sessionID={sessionID} onNavigate={navigateToScreen} />;
      case 'beneficiaries':
        return <BeneficiaryGroups sessionID={sessionID} onNavigate={navigateToScreen} />;
      case 'budget':
        return <BudgetAllocation sessionID={sessionID} onNavigate={navigateToScreen} />;
      case 'ask04':
        return <Ask04 sessionID={sessionID} onNavigate={navigateToScreen} journeyData={userJourneyData} />;
      case 'ask05':
        return <Ask05 sessionID={sessionID} onNavigate={navigateToScreen} />;
      case 'fakeNews':
        return <FakeNewsTest sessionID={sessionID} onNavigate={navigateToScreen} />;
      case 'endScreen':
        return <EndScreen sessionID={sessionID} onNavigate={navigateToScreen} journeyData={userJourneyData} />;
      case null:
        return <IndexPage onNavigate={navigateToScreen} />;
      default:
        return (
          <div className="game-container flex items-center justify-center text-center min-h-screen">
            <div>
              <h1 className="question-text">ไม่พบหน้าที่ต้องการ</h1>
              <p className="text-lg mb-6">Screen "{activeScreen}" ไม่ถูกต้อง</p>
              <button 
                className="btn-primary max-w-xs"
                onClick={() => navigateToScreen('index')}
              >
                กลับสู่หน้าหลัก
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderJourneyComponent()}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<JourneyRouter />} />
          <Route path="*" element={<JourneyRouter />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
