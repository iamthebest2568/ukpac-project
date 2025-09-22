import "./global.css";

import React, { Suspense, lazy, useEffect } from "react";
import RouteTransition from "./components/shared/RouteTransition";
import SuspenseFallback from "./components/shared/SuspenseFallback";
import TabletMockup from "./components/TabletMockup";
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
const PdpaScreen = lazy(() => import("./pages/ukpack2/screens/PdpaScreen"));
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
const SkipEndPage = lazy(() => import("./pages/ukpack2/screens/SkipEnd"));
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

  // Page view / navigation logging for ukpack2
  const prevPathRef = React.useRef<string | null>(null);
  const enterTsRef = React.useRef<number>(Date.now());

  React.useEffect(() => {
    try {
      // Only track ukpack2 routes (project scope)
      const path = location.pathname + (location.search || "");
      const now = Date.now();
      // send PAGE_VIEW
      try {
        // lazy-import to avoid circular deps
        import("./services/dataLogger").then((m) => {
          try {
            m.logEvent({
              event: "PAGE_VIEW",
              payload: { path, ts: new Date().toISOString() },
            });
          } catch (_) {}
        });
      } catch (_) {}

      // if previous path exists, send PAGE_EXIT with duration
      const prev = prevPathRef.current;
      const enteredAt = enterTsRef.current || now;
      if (prev && prev !== path) {
        try {
          import("./services/dataLogger").then((m) => {
            try {
              m.logEvent({
                event: "PAGE_EXIT",
                payload: {
                  path: prev,
                  durationMs: now - enteredAt,
                  ts: new Date().toISOString(),
                },
              });
            } catch (_) {}
          });
        } catch (_) {}
      }
      prevPathRef.current = path;
      enterTsRef.current = now;

      const onUnload = () => {
        try {
          const p = prevPathRef.current;
          const entered = enterTsRef.current || Date.now();
          if (p) {
            // Fire-and-forget synchronous navigator.sendBeacon if available
            try {
              const payload = JSON.stringify({
                event: "PAGE_EXIT",
                payload: {
                  path: p,
                  durationMs: Date.now() - entered,
                  ts: new Date().toISOString(),
                },
              });
              if (
                navigator &&
                typeof (navigator as any).sendBeacon === "function"
              ) {
                (navigator as any).sendBeacon("/api/track", payload);
              } else {
                // best-effort fetch
                fetch("/api/track", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: payload,
                }).catch(() => {});
              }
            } catch (_) {}
          }
        } catch (_) {}
      };
      window.addEventListener("pagehide", onUnload);
      window.addEventListener("beforeunload", onUnload);
      return () => {
        window.removeEventListener("pagehide", onUnload);
        window.removeEventListener("beforeunload", onUnload);
      };
    } catch (_) {}
  }, [location]);

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
  // initialize ukpack2 analytics only on ukpack2 routes
  if (isFullBleed) {
    try {
      import("./pages/ukpack2/uk2Analytics")
        .then((m) => m.initUkpack2Analytics())
        .catch(() => {});
    } catch (_) {}
  }

  // Show tablet mockup only when viewport is >= 810px and not inside embedded iframe
  const isEmbedded = React.useMemo(() => {
    try {
      return new URLSearchParams(location.search).get("embedded") === "1";
    } catch (e) {
      return false;
    }
  }, [location.search]);

  const [useMock, setUseMock] = React.useState<boolean>(
    typeof window !== "undefined" && window.innerWidth >= 810 && !isEmbedded,
  );
  React.useEffect(() => {
    const onResize = () => {
      try {
        setUseMock(window.innerWidth >= 810 && !isEmbedded);
      } catch (e) {}
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isEmbedded]);

  // compute iframe src for embedding current route (add embedded=1 to avoid recursive mock)
  const iframeSrc = React.useMemo(() => {
    try {
      const sp = new URLSearchParams(location.search);
      if (!sp.has("embedded")) sp.set("embedded", "1");
      return location.pathname + "?" + sp.toString();
    } catch (e) {
      return location.pathname;
    }
  }, [location.pathname, location.search]);

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
          aria-label="ข้ามไปยังเนื้อหาหลัก"
        >
          ข้ามไปยังเนื้อหาหลัก
        </a>
        {useMock ? (
          <TabletMockup>
            <main
              id="main-content"
              role="main"
              className={`w-full responsive-content ${isFullBleed ? "" : "h-full overflow-hidden"}`}
            >
              {isFullBleed ? (
                children
              ) : (
                <div style={{ height: "100%", overflow: "hidden" }}>
                  {children}
                </div>
              )}
            </main>
          </TabletMockup>
        ) : (
          <main
            id="main-content"
            role="main"
            className={`w-full responsive-content ${isFullBleed ? "" : "h-full overflow-hidden"}`}
          >
            {isFullBleed ? (
              children
            ) : (
              <div style={{ height: "100%", overflow: "hidden" }}>
                {children}
              </div>
            )}
          </main>
        )}
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
                <Route path="/ukpack2/pdpa" element={<PdpaScreen />} />
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
                <Route path="/ukpack2/skip-end" element={<SkipEndPage />} />
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
