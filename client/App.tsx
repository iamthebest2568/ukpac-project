import "./global.css";

import { Suspense, lazy, useEffect } from "react";
import RouteTransition from "./components/shared/RouteTransition";
import SuspenseFallback from "./components/shared/SuspenseFallback";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { BusDesignProvider } from "./pages/ukpack2/context/BusDesignContext";

// Minimal set of pages (dashboard/backend removed)
const NotFound = lazy(() => import("./pages/NotFound"));
const TestPage = lazy(() => import("./TestPage"));

// Main entry
const IndexPage = lazy(() => import("./pages/Index"));

// Survey pages (Ask01 removed)
const Ask02Page = lazy(() => import("./pages/ukpack1/Ask02Page"));
const Ask02_2Page = lazy(() => import("./pages/ukpack1/Ask02_2Page"));
const Ask04Page = lazy(() => import("./pages/ukpack1/Ask04Page"));
const Ask04BudgetPage = lazy(() => import("./pages/ukpack1/Ask04BudgetPage"));
const Ask05Page = lazy(() => import("./pages/ukpack1/Ask05Page"));

// Other needed pages
const FakeNewsPage = lazy(() => import("./pages/ukpack1/FakeNewsPage"));
const SourceSelectionPage = lazy(
  () => import("./pages/ukpack1/SourceSelectionPage"),
);
const BudgetPage = lazy(() => import("./pages/ukpack1/BudgetPage"));
const EndSequencePage = lazy(() => import("./pages/ukpack1/EndSequencePage"));
const EndScreenPage = lazy(() => import("./pages/ukpack1/EndScreenPage"));
const MiniGameMN1Page = lazy(() => import("./pages/ukpack1/MiniGameMN1Page"));
const MiniGameMN2Page = lazy(() => import("./pages/ukpack1/MiniGameMN2Page"));
const MiniGameMN01Page = lazy(() => import("./pages/ukpack1/MiniGameMN01Page"));
import MiniGameMN3Page from "./pages/MiniGameMN3Page";
const UkStornaway = lazy(() => import("./pages/ukpack1/Uk-stornaway"));
const UkDashboard = lazy(() => import("./pages/ukpack1/UkDashboard"));
const ReasonOther01Page = lazy(
  () => import("./pages/ukpack1/ReasonOther01Page"),
);
const WhatDoYouTravelByPage = lazy(
  () => import("./pages/ukpack1/WhatDoYouTravelByPage"),
);
const HowDoYouThinkPage = lazy(
  () => import("./pages/ukpack1/HowDoYouThinkPage"),
);
const SplashScreen = lazy(() => import("./pages/ukpack2/screens/SplashScreen"));
const AmenitiesScreen = lazy(
  () => import("./pages/ukpack2/screens/AmenitiesScreen"),
);
const ChassisScreen = lazy(
  () => import("./pages/ukpack2/screens/ChassisScreen"),
);
const SeatingScreen = lazy(
  () => import("./pages/ukpack2/screens/SeatingScreen"),
);
const PaymentScreen = lazy(
  () => import("./pages/ukpack2/screens/PaymentScreen"),
);
const DoorScreen = lazy(() => import("./pages/ukpack2/screens/DoorScreen"));
const DesignScreen = lazy(() => import("./pages/ukpack2/screens/DesignScreen"));
const SummaryScreen = lazy(
  () => import("./pages/ukpack2/screens/SummaryScreen"),
);
const FeedbackScreen = lazy(
  () => import("./pages/ukpack2/screens/FeedbackScreen"),
);
const InfoScreen = lazy(() => import("./pages/ukpack2/screens/InfoScreen"));
const InfoNextScreen = lazy(
  () => import("./pages/ukpack2/screens/InfoNextScreen"),
);
const SubmitScreen = lazy(() => import("./pages/ukpack2/screens/SubmitScreen"));
const FeedbackSkipScreen = lazy(
  () => import("./pages/ukpack2/screens/FeedbackSkipScreen"),
);
const ThankYouScreen = lazy(
  () => import("./pages/ukpack2/screens/ThankYouScreen"),
);
const FormScreen = lazy(() => import("./pages/ukpack2/screens/FormScreen"));
const ConfirmationScreen = lazy(
  () => import("./pages/ukpack2/screens/ConfirmationScreen"),
);
const EndScreen = lazy(() => import("./pages/ukpack2/screens/EndScreen"));
const SkipEndPage = lazy(() => import("./pages/SkipEnd"));
const UkPack2Dashboard = lazy(() => import("./pages/ukpack2/UkDashboard"));

// Layout component with accessibility features
import FakeNewsSkeleton from "./components/shared/skeletons/FakeNewsSkeleton";
import SourceSelectionSkeleton from "./components/shared/skeletons/SourceSelectionSkeleton";
import MN3Skeleton from "./components/shared/skeletons/MN3Skeleton";
import BudgetSkeleton from "./components/shared/skeletons/BudgetSkeleton";
import AskSkeleton from "./components/shared/skeletons/AskSkeleton";
import EndSequenceSkeleton, {
  EndScreenSkeleton,
} from "./components/shared/skeletons/EndSkeletons";
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isDashboard =
    /^\/ukpack1\/(uk-dashboard|ukdashboard\.html|UkDashboard)$/.test(
      location.pathname,
    );
  if (isDashboard) {
    return (
      <div className="min-h-screen w-screen bg-[#0b0b0b] text-white">
        <main
          id="main-content"
          role="main"
          className="w-full min-h-screen overflow-auto"
        >
          {children}
        </main>
      </div>
    );
  }
  const isFullBleed = location.pathname.startsWith("/ukpack2");
  return (
    <div
      className={`min-h-screen flex justify-center ${isFullBleed ? "bg-white full-bleed-page" : "bg-[#2a2a2a]"}`}
    >
      {/* Fixed 1080px mobile-first container */}
      <div
        className={`app-container bg-white relative responsive-container ${isFullBleed ? "safe-bottom" : "safe-top safe-bottom"} ${isFullBleed ? "" : "h-screen"}`}
        style={
          isFullBleed
            ? { width: "100%", padding: 0 }
            : { width: "100%", maxWidth: "100%" }
        }
      >
        <a
          href="#main-content"
          className="skip-link sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-yellow-400 text-black px-2 py-1 rounded touch-target"
          aria-label="ข้ามไปยังเนื้อหาหลั��"
        >
          ข้ามไปยังเนื้อหาหลัก
        </a>
        <main
          id="main-content"
          role="main"
          className={`w-full responsive-content ${isFullBleed ? "" : "h-full overflow-hidden"}`}
        >
          {isFullBleed ? (
            children
          ) : (
            <div style={{ height: "100%", overflow: "hidden" }}>{children}</div>
          )}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const preload = () => {
      const tasks = [
        import("./pages/ukpack1/Ask02Page"),
        import("./pages/ukpack1/Ask02_2Page"),
        import("./pages/ukpack1/Ask04Page"),
        import("./pages/ukpack1/Ask04BudgetPage"),
        import("./pages/ukpack1/Ask05Page"),
        import("./pages/ukpack1/FakeNewsPage"),
        import("./pages/ukpack1/SourceSelectionPage"),
        import("./pages/ukpack1/BudgetPage"),
        import("./pages/ukpack1/EndSequencePage"),
        import("./pages/ukpack1/EndScreenPage"),
        import("./pages/ukpack1/MiniGameMN1Page"),
        import("./pages/ukpack1/MiniGameMN2Page"),
        import("./pages/ukpack1/MiniGameMN01Page"),
        import("./pages/ukpack1/MiniGameMN3Page"),
        import("./pages/ukpack1/HowDoYouThinkPage"),
        import("./pages/ukpack1/Uk-stornaway"),
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
            <BusDesignProvider>
              <Routes>
                {/* Main entry */}
                <Route path="/" element={<IndexPage />} />
                <Route
                  path="/ukpack1"
                  element={<Navigate to="/ukpack1/uk-stornaway" replace />}
                />
                <Route path="/ukpack2" element={<SplashScreen />} />
                <Route
                  path="/ukpack2/dashboard"
                  element={<UkPack2Dashboard />}
                />
                <Route path="/ukpack2/chassis" element={<ChassisScreen />} />
                <Route path="/ukpack2/seating" element={<SeatingScreen />} />
                <Route
                  path="/ukpack2/amenities"
                  element={<AmenitiesScreen />}
                />
                <Route path="/ukpack2/payment" element={<PaymentScreen />} />
                <Route path="/ukpack2/doors" element={<DoorScreen />} />
                <Route path="/ukpack2/design" element={<DesignScreen />} />
                <Route path="/ukpack2/summary" element={<SummaryScreen />} />
                <Route path="/ukpack2/info" element={<InfoScreen />} />
                <Route path="/ukpack2/info-next" element={<InfoNextScreen />} />
                <Route path="/ukpack2/feedback" element={<FeedbackScreen />} />
                <Route
                  path="/ukpack2/feedback-skip"
                  element={<FeedbackSkipScreen />}
                />
                <Route path="/ukpack2/submit" element={<SubmitScreen />} />
                <Route path="/ukpack2/thank-you" element={<ThankYouScreen />} />
                <Route path="/ukpack2/form" element={<FormScreen />} />
                <Route
                  path="/ukpack2/confirmation"
                  element={<ConfirmationScreen />}
                />
                <Route path="/ukpack2/end" element={<EndScreen />} />
                <Route path="/skip-end" element={<SkipEndPage />} />
                <Route path="/test" element={<TestPage />} />

                {/* Survey (Ask01 removed) */}
                <Route
                  path="/ukpack1/ask02"
                  element={
                    <Suspense fallback={<AskSkeleton />}>
                      <Ask02Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/ask02-2"
                  element={
                    <Suspense fallback={<AskSkeleton />}>
                      <Ask02_2Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/ask04"
                  element={
                    <Suspense fallback={<AskSkeleton />}>
                      <Ask04Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/ask04-budget"
                  element={
                    <Suspense fallback={<AskSkeleton />}>
                      <Ask04BudgetPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/ask05"
                  element={
                    <Suspense fallback={<AskSkeleton />}>
                      <Ask05Page />
                    </Suspense>
                  }
                />

                {/* Other pages */}
                <Route
                  path="/ukpack1/fake-news"
                  element={
                    <Suspense fallback={<FakeNewsSkeleton />}>
                      <FakeNewsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/source-selection"
                  element={
                    <Suspense fallback={<SourceSelectionSkeleton />}>
                      <SourceSelectionPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/budget"
                  element={
                    <Suspense fallback={<BudgetSkeleton />}>
                      <BudgetPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/end-sequence"
                  element={
                    <Suspense fallback={<EndSequenceSkeleton />}>
                      <EndSequencePage />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/end-screen"
                  element={
                    <Suspense fallback={<EndScreenSkeleton />}>
                      <EndScreenPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/minigame-mn1"
                  element={
                    <Suspense fallback={<MN3Skeleton />}>
                      <MiniGameMN01Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/minigame-mn1-backup"
                  element={
                    <Suspense fallback={<MN3Skeleton />}>
                      <MiniGameMN1Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/minigame-mn2"
                  element={
                    <Suspense fallback={<MN3Skeleton />}>
                      <MiniGameMN2Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/minigame-mn3"
                  element={
                    <Suspense fallback={<MN3Skeleton />}>
                      <MiniGameMN3Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/uk-stornaway"
                  element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <UkStornaway />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/Uk-stornaway"
                  element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <UkStornaway />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/reason-other-01"
                  element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <ReasonOther01Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/what-do-you-travel-by"
                  element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <WhatDoYouTravelByPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/ukdashboard.html"
                  element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <UkDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/uk-dashboard"
                  element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <UkDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/UkDashboard"
                  element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <UkDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="/ukpack1/how-do-you-think"
                  element={
                    <Suspense fallback={<AskSkeleton />}>
                      <HowDoYouThinkPage />
                    </Suspense>
                  }
                />

                {/* Legacy alias routes (cleaned) */}
                <Route
                  path="/Ask02Page"
                  element={<Navigate to="/ukpack1/ask02" replace />}
                />
                <Route
                  path="/ukpack1/Ask02Page"
                  element={<Navigate to="/ukpack1/ask02" replace />}
                />
                <Route
                  path="/Ask02_2Page"
                  element={<Navigate to="/ukpack1/ask02-2" replace />}
                />
                <Route
                  path="/ukpack1/Ask02_2Page"
                  element={<Navigate to="/ukpack1/ask02-2" replace />}
                />
                <Route
                  path="/Ask04Page"
                  element={<Navigate to="/ukpack1/ask04" replace />}
                />
                <Route
                  path="/ukpack1/Ask04Page"
                  element={<Navigate to="/ukpack1/ask04" replace />}
                />
                <Route
                  path="/Ask04BudgetPage"
                  element={<Navigate to="/ukpack1/ask04-budget" replace />}
                />
                <Route
                  path="/Ask05Page"
                  element={<Navigate to="/ukpack1/ask05" replace />}
                />
                <Route
                  path="/ukpack1/Ask05Page"
                  element={<Navigate to="/ukpack1/ask05" replace />}
                />
                <Route
                  path="/BudgetPage"
                  element={<Navigate to="/ukpack1/budget" replace />}
                />
                <Route
                  path="/ukpack1/BudgetPage"
                  element={<Navigate to="/ukpack1/budget" replace />}
                />
                <Route
                  path="/FakeNewsPage"
                  element={<Navigate to="/ukpack1/fake-news" replace />}
                />
                <Route
                  path="/SourceSelectionPage"
                  element={<Navigate to="/ukpack1/source-selection" replace />}
                />
                <Route
                  path="/ukpack1/SourceSelection"
                  element={<Navigate to="/ukpack1/source-selection" replace />}
                />
                <Route
                  path="/SourceSelection"
                  element={<Navigate to="/ukpack1/source-selection" replace />}
                />
                <Route
                  path="/EndSequencePage"
                  element={<Navigate to="/ukpack1/end-sequence" replace />}
                />
                <Route
                  path="/ukpack1/EndSequencePage"
                  element={<Navigate to="/ukpack1/end-sequence" replace />}
                />
                <Route
                  path="/ukpack1/Step1_Decision"
                  element={<Navigate to="/ukpack1/end-sequence" replace />}
                />
                <Route
                  path="/Step1_Decision"
                  element={<Navigate to="/ukpack1/end-sequence" replace />}
                />
                <Route
                  path="/EndScreenPage"
                  element={<Navigate to="/ukpack1/end-screen" replace />}
                />
                <Route
                  path="/MiniGameMN01Page"
                  element={<Navigate to="/ukpack1/minigame-mn1" replace />}
                />
                <Route
                  path="/MiniGameMN1Page"
                  element={<Navigate to="/ukpack1/minigame-mn1" replace />}
                />
                <Route
                  path="/MiniGameMN2Page"
                  element={<Navigate to="/ukpack1/minigame-mn2" replace />}
                />
                <Route
                  path="/MiniGameMN3Page"
                  element={<Navigate to="/ukpack1/minigame-mn3" replace />}
                />
                <Route
                  path="/ukpack1/MiniGameMN3Page"
                  element={<Navigate to="/ukpack1/minigame-mn3" replace />}
                />
                <Route
                  path="/UkStornawayPage"
                  element={<Navigate to="/ukpack1/uk-stornaway" replace />}
                />
                {/* Root-level legacy aliases for Stornaway */}
                <Route
                  path="/Uk-stornaway"
                  element={<Navigate to="/ukpack1/uk-stornaway" replace />}
                />
                <Route
                  path="/uk-stornaway"
                  element={<Navigate to="/ukpack1/uk-stornaway" replace />}
                />
                {/* Legacy aliases for ReasonOther01 */}
                <Route
                  path="/ukpack1/ReasonOther01Page"
                  element={<Navigate to="/ukpack1/reason-other-01" replace />}
                />
                <Route
                  path="/ReasonOther01Page"
                  element={<Navigate to="/ukpack1/reason-other-01" replace />}
                />
                {/* Legacy aliases for WhatDoYouTravelBy */}
                <Route
                  path="/ukpack1/WhatDoYouTravelByPage"
                  element={
                    <Navigate to="/ukpack1/what-do-you-travel-by" replace />
                  }
                />
                <Route
                  path="/WhatDoYouTravelByPage"
                  element={
                    <Navigate to="/ukpack1/what-do-you-travel-by" replace />
                  }
                />

                {/* Legacy dashboard aliases */}
                <Route
                  path="/ukdashboard"
                  element={<Navigate to="/ukpack1/uk-dashboard" replace />}
                />
                <Route
                  path="/UkDashboard"
                  element={<Navigate to="/ukpack1/uk-dashboard" replace />}
                />

                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BusDesignProvider>
          </RouteTransition>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
