import "./global.css";

import { Suspense, lazy, useEffect } from "react";
import RouteTransition from "./components/shared/RouteTransition";
import SuspenseFallback from "./components/shared/SuspenseFallback";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Minimal set of pages (dashboard/backend removed)
const NotFound = lazy(() => import("./pages/NotFound"));
const TestPage = lazy(() => import("./TestPage"));

// Main entry
const IndexPage = lazy(() => import("./pages/Index"));

// Survey pages (Ask01 removed)
const Ask02Page = lazy(() => import("./pages/Ask02Page"));
const Ask02_2Page = lazy(() => import("./pages/Ask02_2Page"));
const Ask04Page = lazy(() => import("./pages/Ask04Page"));
const Ask04BudgetPage = lazy(() => import("./pages/Ask04BudgetPage"));
const Ask05Page = lazy(() => import("./pages/Ask05Page"));

// Other needed pages
const FakeNewsPage = lazy(() => import("./pages/FakeNewsPage"));
const SourceSelectionPage = lazy(() => import("./pages/SourceSelectionPage"));
const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const EndSequencePage = lazy(() => import("./pages/EndSequencePage"));
const EndScreenPage = lazy(() => import("./pages/EndScreenPage"));
const MiniGameMN1Page = lazy(() => import("./pages/MiniGameMN1Page"));
const MiniGameMN2Page = lazy(() => import("./pages/MiniGameMN2Page"));
const MiniGameMN3Page = lazy(() => import("./pages/MiniGameMN3Page"));
const UkStornaway = lazy(() => import("./pages/Uk-stornaway"));
const UkDashboard = lazy(() => import("./pages/UkDashboard"));

// Layout component with accessibility features
import FakeNewsSkeleton from './components/shared/skeletons/FakeNewsSkeleton';
import SourceSelectionSkeleton from './components/shared/skeletons/SourceSelectionSkeleton';
import MN3Skeleton from './components/shared/skeletons/MN3Skeleton';
import BudgetSkeleton from './components/shared/skeletons/BudgetSkeleton';
import AskSkeleton from './components/shared/skeletons/AskSkeleton';
import EndSequenceSkeleton, { EndScreenSkeleton } from './components/shared/skeletons/EndSkeletons';
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex justify-center bg-[#2a2a2a]">
    {/* Fixed 1080px mobile-first container */}
    <div className="w-full max-w-[1080px] min-h-screen bg-white overflow-y-auto relative">
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-yellow-400 text-black px-2 py-1 rounded"
        aria-label="ข้ามไปยังเนื้อหาหลัก"
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>
      <main id="main-content" role="main" className="w-full h-full">
        {children}
      </main>
    </div>
  </div>
);

const App = () => {
  useEffect(() => {
    const preload = () => {
      const tasks = [
        import("./pages/Ask02Page"),
        import("./pages/Ask02_2Page"),
        import("./pages/Ask04Page"),
        import("./pages/Ask04BudgetPage"),
        import("./pages/Ask05Page"),
        import("./pages/FakeNewsPage"),
        import("./pages/SourceSelectionPage"),
        import("./pages/BudgetPage"),
        import("./pages/EndSequencePage"),
        import("./pages/EndScreenPage"),
        import("./pages/MiniGameMN1Page"),
        import("./pages/MiniGameMN2Page"),
        import("./pages/MiniGameMN3Page"),
        import("./pages/Uk-stornaway"),
      ];
      Promise.allSettled(tasks);
    };
    if (typeof (window as any).requestIdleCallback === "function") {
      (window as any).requestIdleCallback(preload);
    } else {
      setTimeout(preload, 1000);
    }
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<SuspenseFallback />}>
          {/* Smooth client-side route transitions without changing logic */}
          <RouteTransition>
            <Routes>
              {/* Main entry */}
              <Route path="/" element={<IndexPage />} />
              <Route path="/test" element={<TestPage />} />

              {/* Survey (Ask01 removed) */}
              <Route path="/ask02" element={
                <Suspense fallback={<AskSkeleton />}>
                  <Ask02Page />
                </Suspense>
              } />
              <Route path="/ask02-2" element={
                <Suspense fallback={<AskSkeleton />}>
                  <Ask02_2Page />
                </Suspense>
              } />
              <Route path="/ask04" element={
                <Suspense fallback={<AskSkeleton />}>
                  <Ask04Page />
                </Suspense>
              } />
              <Route path="/ask04-budget" element={
                <Suspense fallback={<AskSkeleton />}>
                  <Ask04BudgetPage />
                </Suspense>
              } />
              <Route path="/ask05" element={
                <Suspense fallback={<AskSkeleton />}>
                  <Ask05Page />
                </Suspense>
              } />

              {/* Other pages */}
              <Route path="/fake-news" element={
                <Suspense fallback={<FakeNewsSkeleton />}>
                  <FakeNewsPage />
                </Suspense>
              } />
              <Route path="/source-selection" element={
                <Suspense fallback={<SourceSelectionSkeleton />}>
                  <SourceSelectionPage />
                </Suspense>
              } />
              <Route path="/budget" element={
                <Suspense fallback={<BudgetSkeleton />}>
                  <BudgetPage />
                </Suspense>
              } />
              <Route path="/end-sequence" element={
                <Suspense fallback={<EndSequenceSkeleton />}>
                  <EndSequencePage />
                </Suspense>
              } />
              <Route path="/end-screen" element={
                <Suspense fallback={<EndScreenSkeleton />}>
                  <EndScreenPage />
                </Suspense>
              } />
              <Route path="/minigame-mn1" element={
                <Suspense fallback={<MN3Skeleton />}>
                  <MiniGameMN1Page />
                </Suspense>
              } />
              <Route path="/minigame-mn2" element={
                <Suspense fallback={<MN3Skeleton />}>
                  <MiniGameMN2Page />
                </Suspense>
              } />
              <Route path="/minigame-mn3" element={
                <Suspense fallback={<MN3Skeleton />}>
                  <MiniGameMN3Page />
                </Suspense>
              } />
              <Route path="/uk-stornaway" element={
                <Suspense fallback={<SuspenseFallback />}>
                  <UkStornaway />
                </Suspense>
              } />
              <Route path="/Uk-stornaway" element={
                <Suspense fallback={<SuspenseFallback />}>
                  <UkStornaway />
                </Suspense>
              } />
              <Route path="/ukdashboard.html" element={
                <Suspense fallback={<SuspenseFallback />}>
                  <UkDashboard />
                </Suspense>
              } />
              <Route path="/uk-dashboard" element={
                <Suspense fallback={<SuspenseFallback />}>
                  <UkDashboard />
                </Suspense>
              } />
              <Route path="/UkDashboard" element={
                <Suspense fallback={<SuspenseFallback />}>
                  <UkDashboard />
                </Suspense>
              } />

              {/* Legacy alias routes (cleaned) */}
              <Route
                path="/Ask02Page"
                element={<Navigate to="/ask02" replace />}
              />
              <Route
                path="/Ask02_2Page"
                element={<Navigate to="/ask02-2" replace />}
              />
              <Route
                path="/Ask04Page"
                element={<Navigate to="/ask04" replace />}
              />
              <Route
                path="/Ask04BudgetPage"
                element={<Navigate to="/ask04-budget" replace />}
              />
              <Route
                path="/Ask05Page"
                element={<Navigate to="/ask05" replace />}
              />
              <Route
                path="/BudgetPage"
                element={<Navigate to="/budget" replace />}
              />
              <Route
                path="/FakeNewsPage"
                element={<Navigate to="/fake-news" replace />}
              />
              <Route
                path="/SourceSelectionPage"
                element={<Navigate to="/source-selection" replace />}
              />
              <Route
                path="/EndSequencePage"
                element={<Navigate to="/end-sequence" replace />}
              />
              <Route
                path="/EndScreenPage"
                element={<Navigate to="/end-screen" replace />}
              />
              <Route
                path="/MiniGameMN1Page"
                element={<Navigate to="/minigame-mn1" replace />}
              />
              <Route
                path="/MiniGameMN2Page"
                element={<Navigate to="/minigame-mn2" replace />}
              />
              <Route
                path="/MiniGameMN3Page"
                element={<Navigate to="/minigame-mn3" replace />}
              />
              <Route
                path="/UkStornawayPage"
                element={<Navigate to="/uk-stornaway" replace />}
              />

              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RouteTransition>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
