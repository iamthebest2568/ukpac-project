import "./global.css";

import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Minimal set of pages (dashboard/backend removed)
const NotFound = lazy(() => import("./pages/NotFound"));
const TestPage = lazy(() => import("./TestPage"));

// Intro pages
const IndexPage = lazy(() => import("./pages/Index"));
const UltraSimplePage = lazy(() => import("./pages/UltraSimplePage"));
const IntroWhoAreYouPage = lazy(() => import("./pages/IntroWhoAreYouPage"));
const IntroGenderPage = lazy(() => import("./pages/IntroGenderPage"));
const IntroGroupSelectionPage = lazy(() => import("./pages/IntroGroupSelectionPage"));
const IntroTravelModeCityPage = lazy(() => import("./pages/IntroTravelModeCityPage"));
const IntroTravelFreqCityPage = lazy(() => import("./pages/IntroTravelFreqCityPage"));
const IntroPolicyThoughtsPage = lazy(() => import("./pages/IntroPolicyThoughtsPage"));
const IntroReplyFriendPage = lazy(() => import("./pages/IntroReplyFriendPage"));
const IntroPolicyFeelPage = lazy(() => import("./pages/IntroPolicyFeelPage"));

// Survey pages
const Ask01Page = lazy(() => import("./pages/Ask01Page"));
const Ask02Page = lazy(() => import("./pages/Ask02Page"));
const Ask04Page = lazy(() => import("./pages/Ask04Page"));
const Ask05Page = lazy(() => import("./pages/Ask05Page"));

// Other needed pages
const FakeNewsPage = lazy(() => import("./pages/FakeNewsPage"));
const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const EndScreenPage = lazy(() => import("./pages/EndScreenPage"));

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
  <BrowserRouter>
    <Layout>
      <Suspense fallback={<div style={{color:'#fff',padding:20}}>กำลังโหลด...</div>}>
        <Routes>
          {/* Main entry */}
          <Route path="/" element={<IndexPage />} />
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

          {/* Legacy alias routes (case/filename-based deep links) */}
          <Route path="/Ask01Page" element={<Navigate to="/ask01" replace />} />
          <Route path="/Ask02Page" element={<Navigate to="/ask02" replace />} />
          <Route path="/Ask04Page" element={<Navigate to="/ask04" replace />} />
          <Route path="/Ask05Page" element={<Navigate to="/ask05" replace />} />
          <Route path="/BudgetPage" element={<Navigate to="/budget" replace />} />
          <Route path="/FakeNewsPage" element={<Navigate to="/fake-news" replace />} />
          <Route path="/EndScreenPage" element={<Navigate to="/end-screen" replace />} />
          <Route path="/IntroWhoAreYouPage" element={<Navigate to="/intro-who-are-you" replace />} />
          <Route path="/IntroGenderPage" element={<Navigate to="/intro-gender" replace />} />
          <Route path="/IntroGroupSelectionPage" element={<Navigate to="/intro-group-selection" replace />} />
          <Route path="/IntroTravelModeCityPage" element={<Navigate to="/intro-travel-mode-city" replace />} />
          <Route path="/IntroTravelFreqCityPage" element={<Navigate to="/intro-travel-freq-city" replace />} />
          <Route path="/IntroPolicyThoughtsPage" element={<Navigate to="/intro-policy-thoughts" replace />} />
          <Route path="/IntroReplyFriendPage" element={<Navigate to="/intro-reply-friend" replace />} />
          <Route path="/IntroPolicyFeelPage" element={<Navigate to="/intro-policy-feel" replace />} />
          <Route path="/UltraSimplePage" element={<Navigate to="/" replace />} />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  </BrowserRouter>
);

export default App;
