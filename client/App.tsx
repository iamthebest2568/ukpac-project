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
import DashboardIndex from "./pages/DashboardIndex";
import Ask01 from "./components/journey/Ask01";
import Ask02 from "./components/journey/Ask02";
import Ask02_2 from "./components/journey/Ask02_2";
import Ask04 from "./components/journey/Ask04";
import Ask04Budget from "./components/journey/Ask04Budget";
import Ask05 from "./components/journey/Ask05";
// End screens
import EndScreen from "./components/games/ThankYouScreen";
import PolicySummary from "./components/journey/PolicySummary";
import BudgetStep1Choice from "./components/journey/BudgetStep1Choice";
import BudgetStep2Allocation from "./components/journey/BudgetStep2Allocation";
import BudgetStep3Result from "./components/journey/BudgetStep3Result";

// Agree journey components
import SourceSelection from "./components/journey/SourceSelection";
import RewardDecision from "./components/journey/RewardDecision";
import RewardForm from "./components/journey/RewardForm";
import FinalThankYou from "./components/journey/FinalThankYou";

// Flow containers
import Flow_MiniGame_MN1 from "./components/flows/Flow_MiniGame_MN1";
import Flow_MiniGame_MN2 from "./components/flows/Flow_MiniGame_MN2";
import Flow_MiniGame_MN3 from "./components/flows/Flow_MiniGame_MN3";
import Flow_EndSequence from "./components/flows/Flow_EndSequence";

// Dashboard
import DashboardApp from "./components/dashboard/DashboardApp";

// Remaining mini-game components
import BudgetAllocation from "./components/games/BudgetAllocation";
import FakeNewsTest from "./components/games/FakeNewsTest";

const queryClient = new QueryClient();

const JourneyRouter = () => {
  const [activeScreen, setActiveScreen] = useState<string | null>(null);
  const [sessionID, setSessionID] = useState<string | null>(null);
  const [userJourneyData, setUserJourneyData] = useState<any>({});
  const [flowData, setFlowData] = useState<any>({}); // Store data from completed flows

  // Add skip link for accessibility
  const SkipLink = () => (
    <a
      href="#main-content"
      className="skip-link"
      aria-label="ข้ามไปยังเนื้อหาหลัก"
    >
      ข้ามไปยังเนื้อหาหลัก
    </a>
  );

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

  // Flow completion handlers
  const handleMN1Complete = (data: any) => {
    setFlowData(prev => ({ ...prev, mn1: data }));
    setActiveScreen('Flow_MiniGame_MN2');
    console.log('MN1 Flow Completed:', data);
  };

  const handleMN2Complete = (data: any) => {
    setFlowData(prev => ({ ...prev, mn2: data }));
    setActiveScreen('ask04');
    console.log('MN2 Flow Completed:', data);
  };

  const handleMN3Complete = (data: any) => {
    setFlowData(prev => ({ ...prev, mn3: data }));
    setActiveScreen('ask04_budget');
    console.log('MN3 Flow Completed:', data);
  };

  const handleEndSequenceComplete = (data: any) => {
    setFlowData(prev => ({ ...prev, endSequence: data }));
    setActiveScreen('index'); // Return to index after completing the journey
    console.log('End Sequence Completed:', data);
  };

  // Render appropriate component based on activeScreen state
  const renderJourneyComponent = () => {
    switch (activeScreen) {
      case 'index':
        return <IndexPage onNavigate={navigateToScreen} />;
      case 'dashboard':
        return <DashboardApp />;
      case 'ask01':
        return <Ask01 sessionID={sessionID} onNavigate={navigateToScreen} />;
      case 'ask02':
        return <Ask02 sessionID={sessionID} onNavigate={navigateToScreen} />;
      case 'ask02_2':
        return <Ask02_2 sessionID={sessionID} onNavigate={navigateToScreen} />;

      // Flow containers
      case 'Flow_MiniGame_MN1':
        return (
          <Flow_MiniGame_MN1
            sessionID={sessionID}
            onComplete={handleMN1Complete}
            onBack={() => navigateToScreen('ask02')}
          />
        );
      case 'Flow_MiniGame_MN2':
        return (
          <Flow_MiniGame_MN2
            sessionID={sessionID}
            onComplete={handleMN2Complete}
            onBack={() => navigateToScreen('Flow_MiniGame_MN1')}
            mn1Data={flowData.mn1}
          />
        );
      case 'Flow_MiniGame_MN3':
        return (
          <Flow_MiniGame_MN3
            sessionID={sessionID}
            onComplete={handleMN3Complete}
            onBack={() => navigateToScreen('ask02')}
          />
        );
      case 'Flow_EndSequence':
        return (
          <Flow_EndSequence
            sessionID={sessionID}
            onComplete={handleEndSequenceComplete}
            onBack={() => navigateToScreen('fakeNews')}
          />
        );

      // Legacy components (still needed for some paths)
      case 'budget':
        return <BudgetAllocation sessionID={sessionID} onNavigate={navigateToScreen} />;

      // Core journey components
      case 'ask04':
        return <Ask04 sessionID={sessionID} onNavigate={navigateToScreen} journeyData={userJourneyData} />;
      case 'ask04_budget':
        return <Ask04Budget sessionID={sessionID} onNavigate={navigateToScreen} journeyData={userJourneyData} />;
      case 'ask05':
        return <Ask05 sessionID={sessionID} onNavigate={navigateToScreen} />;
      case 'fakeNews':
        return <FakeNewsTest sessionID={sessionID} onNavigate={navigateToScreen} />;
      case 'sourceSelection':
        return <SourceSelection sessionID={sessionID} onNavigate={navigateToScreen} />;

      // End screens
      case 'endScreen':
        return <EndScreen sessionID={sessionID} onNavigate={navigateToScreen} journeyData={userJourneyData} />;
      case 'dashboardIndex':
        return <DashboardIndex onNavigate={navigateToScreen} />;
      case null:
        return <IndexPage onNavigate={navigateToScreen} />;
      default:
        return (
          <div className="theme-white min-h-screen">
            <div className="app-container flex items-center justify-center text-center min-h-screen">
              <div className="animate-fade-in-up">
                <h1 className="text-h2">ไม่พบหน้าที่ต้องการ</h1>
                <p className="text-body mb-6">Screen "{activeScreen}" ไม่ถูกต้อง</p>
                <button
                  className="btn btn-primary max-w-xs"
                  onClick={() => navigateToScreen('index')}
                >
                  กลับสู่หน้าหลัก
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <SkipLink />
      <main id="main-content" role="main">
        {renderJourneyComponent()}
      </main>
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
