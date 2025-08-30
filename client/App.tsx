import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Minimal set of pages (dashboard/backend removed)
import NotFound from "./pages/NotFound";
import TestPage from "./TestPage";

// Intro pages
import IndexPage from "./pages/Index";
import IntroWhoAreYouPage from "./pages/IntroWhoAreYouPage";
import IntroGenderPage from "./pages/IntroGenderPage";
import IntroGroupSelectionPage from "./pages/IntroGroupSelectionPage";
import IntroTravelModeCityPage from "./pages/IntroTravelModeCityPage";
import IntroTravelFreqCityPage from "./pages/IntroTravelFreqCityPage";
import IntroPolicyThoughtsPage from "./pages/IntroPolicyThoughtsPage";
import IntroReplyFriendPage from "./pages/IntroReplyFriendPage";
import IntroPolicyFeelPage from "./pages/IntroPolicyFeelPage";

// Survey pages
import Ask01Page from "./pages/Ask01Page";
import Ask02Page from "./pages/Ask02Page";
import Ask04Page from "./pages/Ask04Page";
import Ask05Page from "./pages/Ask05Page";

// Other needed pages
import FakeNewsPage from "./pages/FakeNewsPage";
import BudgetPage from "./pages/BudgetPage";
import EndScreenPage from "./pages/EndScreenPage";

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
            {/* Main entry */}
            <Route path="/" element={<IndexPage />} />
            <Route path="/IntroStartPage" element={<Navigate to="/" replace />} />
            <Route path="/test" element={<TestPage />} />

            {/* Intro flow */}
            <Route path="/intro-who-are-you" element={<IntroWhoAreYouPage />} />
            <Route path="/intro-gender" element={<IntroGenderPage />} />
            <Route path="/intro-group-selection" element={<IntroGroupSelectionPage />} />
            <Route path="/intro-travel-mode-city" element={<IntroTravelModeCityPage />} />
            <Route path="/intro-travel-freq-city" element={<IntroTravelFreqCityPage />} />
            <Route path="/intro-policy-thoughts" element={<IntroPolicyThoughtsPage />} />
            <Route path="/intro-reply-friend" element={<IntroReplyFriendPage />} />
            <Route path="/intro-policy-feel" element={<IntroPolicyFeelPage />} />

            {/* Survey */}
            <Route path="/ask01" element={<Ask01Page />} />
            <Route path="/ask02" element={<Ask02Page />} />
            <Route path="/ask04" element={<Ask04Page />} />
            <Route path="/ask05" element={<Ask05Page />} />

            {/* Other pages */}
            <Route path="/fake-news" element={<FakeNewsPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/end-screen" element={<EndScreenPage />} />

            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
