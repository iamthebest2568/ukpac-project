import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// Mini-game components
import PolicyPriorities from "./components/games/PolicyPriorities";
import BeneficiaryGroups from "./components/games/BeneficiaryGroups";
import BudgetAllocation from "./components/games/BudgetAllocation";
import FakeNewsTest from "./components/games/FakeNewsTest";
import ThankYouScreen from "./components/games/ThankYouScreen";

const queryClient = new QueryClient();

const GameRouter = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [sessionID, setSessionID] = useState<string | null>(null);

  useEffect(() => {
    // Parse URL query parameters on page load
    const urlParams = new URLSearchParams(window.location.search);
    const gameID = urlParams.get('gameID');
    const sessionIDParam = urlParams.get('sessionID');
    
    setActiveGame(gameID);
    setSessionID(sessionIDParam);
  }, []);

  // Function to navigate between games/screens
  const navigateToGame = (gameId: string) => {
    setActiveGame(gameId);
  };

  // Render appropriate component based on activeGame state
  const renderGameComponent = () => {
    switch (activeGame) {
      case 'priorities':
        return <PolicyPriorities sessionID={sessionID} onNavigate={navigateToGame} />;
      case 'beneficiaries':
        return <BeneficiaryGroups sessionID={sessionID} onNavigate={navigateToGame} />;
      case 'budget':
        return <BudgetAllocation sessionID={sessionID} onNavigate={navigateToGame} />;
      case 'fakeNews':
        return <FakeNewsTest sessionID={sessionID} onNavigate={navigateToGame} />;
      case 'thankYou':
        return <ThankYouScreen sessionID={sessionID} onNavigate={navigateToGame} />;
      case null:
        return (
          <div className="game-container flex items-center justify-center text-center">
            <div>
              <h1 className="question-text">เกมส์โต้ตอบเรื่องการพัฒนาเมือง</h1>
              <p className="text-lg mb-8">กรุณาเพิ่ม gameID ใน URL เพื่อเริ่มเล่นเกม</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>ตัวอย่าง URL:</p>
                <p>?gameID=priorities - นโยบายการพัฒนา</p>
                <p>?gameID=beneficiaries - กลุ่มผู้ได้รับประโยชน์</p>
                <p>?gameID=budget - การจัดสรรงบประมาณ</p>
                <p>?gameID=fakeNews - การรับมือข่าวปลอม</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="game-container flex items-center justify-center text-center">
            <div>
              <h1 className="question-text">ไม่พบเกมที่ต้องการ</h1>
              <p className="text-lg">gameID "{activeGame}" ไม่ถูกต้อง</p>
              <p className="text-sm text-muted-foreground mt-4">
                กรุณาตรวจสอบ URL และลองใหม่อีกครั้ง
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderGameComponent()}
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
          <Route path="/" element={<GameRouter />} />
          <Route path="*" element={<GameRouter />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
