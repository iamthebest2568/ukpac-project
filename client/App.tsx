import "./global.css";

import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Minimal set of pages (dashboard/backend removed)
const NotFound = lazy(() => import("./pages/NotFound"));
const TestPage = lazy(() => import("./TestPage"));

// Intro pages
const IndexPage = lazy(() => import("./pages/Index"));
const UltraSimplePage = lazy(() => import("./pages/UltraSimplePage"));
const IntroWhoAreYouPage = lazy(() => import("./pages/IntroWhoAreYouPage"));
const IntroGenderPage = lazy(() => import("./pages/IntroGenderPage"));
const IntroGroupSelectionPage = lazy(
  () => import("./pages/IntroGroupSelectionPage"),
);
const IntroTravelModeCityPage = lazy(
  () => import("./pages/IntroTravelModeCityPage"),
);
const IntroTravelFreqCityPage = lazy(
  () => import("./pages/IntroTravelFreqCityPage"),
);
const IntroPolicyThoughtsPage = lazy(
  () => import("./pages/IntroPolicyThoughtsPage"),
);
const IntroReplyFriendPage = lazy(() => import("./pages/IntroReplyFriendPage"));
const IntroPolicyFeelPage = lazy(() => import("./pages/IntroPolicyFeelPage"));

// Survey pages
const Ask01Page = lazy(() => import("./pages/Ask01Page"));
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
const Diagnostics = lazy(() => import("./pages/Diagnostics"));

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

const App = () => {
  useEffect(() => {
    const preload = () => {
      const tasks = [
        import("./pages/Ask01Page"),
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
        <Suspense fallback={null}>
          <Routes>
            {/* Main entry */}
            <Route path="/" element={<IndexPage />} />
            <Route path="/test" element={<TestPage />} />

            {/* Intro flow */}
            <Route path="/intro-who-are-you" element={<IntroWhoAreYouPage />} />
            <Route path="/intro-gender" element={<IntroGenderPage />} />
            <Route
              path="/intro-group-selection"
              element={<IntroGroupSelectionPage />}
            />
            <Route
              path="/intro-travel-mode-city"
              element={<IntroTravelModeCityPage />}
            />
            <Route
              path="/intro-travel-freq-city"
              element={<IntroTravelFreqCityPage />}
            />
            <Route
              path="/intro-policy-thoughts"
              element={<IntroPolicyThoughtsPage />}
            />
            <Route
              path="/intro-reply-friend"
              element={<IntroReplyFriendPage />}
            />
            <Route
              path="/intro-policy-feel"
              element={<IntroPolicyFeelPage />}
            />

            {/* Survey */}
            <Route path="/ask01" element={<Ask01Page />} />
            <Route path="/ask02" element={<Ask02Page />} />
            <Route path="/ask02-2" element={<Ask02_2Page />} />
            <Route path="/ask04" element={<Ask04Page />} />
            <Route path="/ask04-budget" element={<Ask04BudgetPage />} />
            <Route path="/ask05" element={<Ask05Page />} />

            {/* Other pages */}
            <Route path="/fake-news" element={<FakeNewsPage />} />
            <Route path="/source-selection" element={<SourceSelectionPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/end-sequence" element={<EndSequencePage />} />
            <Route path="/end-screen" element={<EndScreenPage />} />
            <Route path="/minigame-mn1" element={<MiniGameMN1Page />} />
            <Route path="/minigame-mn2" element={<MiniGameMN2Page />} />
            <Route path="/minigame-mn3" element={<MiniGameMN3Page />} />
            <Route path="/uk-stornaway" element={<UkStornaway />} />
            <Route path="/Uk-stornaway" element={<UkStornaway />} />
            <Route path="/ukdashboard.html" element={<UkDashboard />} />
            <Route path="/uk-dashboard" element={<UkDashboard />} />
            <Route path="/UkDashboard" element={<UkDashboard />} />
            <Route path="/diagnostics" element={<Diagnostics />} />

            {/* Legacy alias routes (case/filename-based deep links) */}
            <Route
              path="/Ask01Page"
              element={<Navigate to="/ask01" replace />}
            />
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
              path="/IntroWhoAreYouPage"
              element={<Navigate to="/intro-who-are-you" replace />}
            />
            <Route
              path="/IntroGenderPage"
              element={<Navigate to="/intro-gender" replace />}
            />
            <Route
              path="/IntroGroupSelectionPage"
              element={<Navigate to="/intro-group-selection" replace />}
            />
            <Route
              path="/IntroTravelModeCityPage"
              element={<Navigate to="/intro-travel-mode-city" replace />}
            />
            <Route
              path="/IntroTravelFreqCityPage"
              element={<Navigate to="/intro-travel-freq-city" replace />}
            />
            <Route
              path="/IntroPolicyThoughtsPage"
              element={<Navigate to="/intro-policy-thoughts" replace />}
            />
            <Route
              path="/IntroReplyFriendPage"
              element={<Navigate to="/intro-reply-friend" replace />}
            />
            <Route
              path="/IntroPolicyFeelPage"
              element={<Navigate to="/intro-policy-feel" replace />}
            />
            <Route
              path="/UltraSimplePage"
              element={<Navigate to="/" replace />}
            />
            <Route
              path="/UkStornawayPage"
              element={<Navigate to="/uk-stornaway" replace />}
            />

            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
