import "./global.css";

import React, { Suspense, lazy, useEffect } from "react";
import RouteTransition from "./components/shared/RouteTransition";
import SuspenseFallback from "./components/shared/SuspenseFallback";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { BusDesignProvider } from "./pages/ukpack2/context/BusDesignContext";
const TabletMockupUk2 = React.lazy(
  () => import("./pages/ukpack2/components/TabletMockup"),
);
const DesktopMockupUk1 = React.lazy(
  () => import("./pages/beforecitychange/components/DesktopMockup"),
);

// Minimal set of pages (dashboard/backend removed)
const NotFound = lazy(() => import("./pages/NotFound"));

// Main entry
const IndexPage = lazy(() => import("./pages/Index"));

// Survey pages (Ask01 removed)
const Ask02Page = lazy(() => import("./pages/beforecitychange/Ask02Page"));
const Ask02_2Page = lazy(() => import("./pages/beforecitychange/Ask02_2Page"));
const Ask04Page = lazy(() => import("./pages/beforecitychange/Ask04Page"));
const Ask04BudgetPage = lazy(
  () => import("./pages/beforecitychange/Ask04BudgetPage"),
);
const Ask05Page = lazy(() => import("./pages/beforecitychange/Ask05Page"));

// Other needed pages
const FakeNewsPage = lazy(
  () => import("./pages/beforecitychange/FakeNewsPage"),
);
const SourceSelectionPage = lazy(
  () => import("./pages/beforecitychange/SourceSelectionPage"),
);
const BudgetPage = lazy(() => import("./pages/beforecitychange/BudgetPage"));
const EndSequencePage = lazy(
  () => import("./pages/beforecitychange/EndSequencePage"),
);
const EndScreenPage = lazy(
  () => import("./pages/beforecitychange/EndScreenPage"),
);
const MiniGameMN1Page = lazy(
  () => import("./pages/beforecitychange/MiniGameMN1Page"),
);
const MiniGameMN2Page = lazy(
  () => import("./pages/beforecitychange/MiniGameMN2Page"),
);
const MiniGameMN01Page = lazy(
  () => import("./pages/beforecitychange/MiniGameMN01Page"),
);
import MiniGameMN3Page from "./pages/MiniGameMN3Page";
const UkStornaway = lazy(() => import("./pages/Uk-stornaway"));
const UkDashboard = lazy(() => import("./pages/beforecitychange/UkDashboard"));
const UkPact1Dashboard = lazy(
  () => import("./pages/beforecitychange/ukpact1-dashboard"),
);
const UkPact2Dashboard = lazy(
  () => import("./pages/ukpack2/ukpact2-dashboard"),
);
const ReasonOther01Page = lazy(
  () => import("./pages/beforecitychange/ReasonOther01Page"),
);
const WhatDoYouTravelByPage = lazy(
  () => import("./pages/beforecitychange/WhatDoYouTravelByPage"),
);
const HowDoYouThinkPage = lazy(
  () => import("./pages/beforecitychange/HowDoYouThinkPage"),
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
import lazyWithRetry from "./lib/lazyWithRetry";
const DesignScreen = lazy(() =>
  lazyWithRetry(() => import("./pages/ukpack2/screens/DesignScreen"), 2, 500),
);
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
const UkPack2Dashboard = lazy(() => import("./pages/mydreambus/UkDashboard"));

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
    /^\/(?:(?:ukpack1|beforecitychange)\/(?:uk-dashboard|ukdashboard\.html|UkDashboard|ukpact1-dashboard)|(?:ukpack2|mydreambus)\/(?:dashboard|ukpact2-dashboard))$/.test(
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
  const isFullBleed = location.pathname.startsWith("/mydreambus");
  const isUkpack1 = location.pathname.startsWith("/beforecitychange");
  // For beforecitychange, the root path (/beforecitychange) is the video page and should be full-bleed.
  const isUkpack1Wrapped =
    isUkpack1 &&
    !(
      location.pathname === "/beforecitychange" ||
      location.pathname === "/beforecitychange/"
    );
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

  // When running inside the embedded iframe for mydreambus, add a body class to apply special responsive CSS
  React.useEffect(() => {
    try {
      const isMydreambus = location.pathname.startsWith("/mydreambus");
      if (isMydreambus) {
        document.body.classList.add("page-mydreambus");
      } else {
        document.body.classList.remove("page-mydreambus");
      }
      if (isEmbedded && isMydreambus) {
        document.body.classList.add("embedded-mydreambus");
      } else {
        document.body.classList.remove("embedded-mydreambus");
      }
    } catch (e) {}

    return () => {
      try {
        document.body.classList.remove("page-mydreambus");
        document.body.classList.remove("embedded-mydreambus");
      } catch (e) {}
    };
  }, [isEmbedded, location.pathname]);

  // Global: suppress noisy "Failed to fetch" errors originating from
  // Firestore SDK background network probes which can occur in restricted
  // hosting environments. We still log other unhandled rejections.
  React.useEffect(() => {
    const handler = (ev: PromiseRejectionEvent) => {
      try {
        const reason = (ev && (ev.reason || ev.detail)) || ev;
        const message =
          reason && reason.message ? String(reason.message) : String(reason);
        // If the error is a generic network failure and comes from firebase
        // internals, swallow it to avoid polluting logs/console in the preview env.
        if (
          /failed to fetch/i.test(message) ||
          /Failed to fetch/i.test(message)
        ) {
          // If stack includes firebase firestore internals, treat as ignorable
          const stack = reason && reason.stack ? String(reason.stack) : "";
          if (/firebase_firestor|firebase_firestore|firestore/i.test(stack)) {
            // prevent default logging
            ev.preventDefault();
            console.debug(
              "Suppressed Firestore network error in preview:",
              message,
            );
            return;
          }
        }
      } catch (_) {}
      // otherwise allow default handling
    };
    window.addEventListener("unhandledrejection", handler as any);
    return () =>
      window.removeEventListener("unhandledrejection", handler as any);
  }, []);

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
          ���้ามไปย���งเนื้อหาหลัก
        </a>
        <main
          id="main-content"
          role="main"
          className={`w-full responsive-content ${isFullBleed ? "" : "h-full overflow-hidden"}`}
        >
          {isFullBleed ? (
            <React.Suspense fallback={<div style={{ height: "100%" }} />}>
              <TabletMockupUk2>{children}</TabletMockupUk2>
            </React.Suspense>
          ) : isUkpack1Wrapped ? (
            <React.Suspense fallback={<div style={{ height: "100%" }} />}>
              <DesktopMockupUk1>{children}</DesktopMockupUk1>
            </React.Suspense>
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
        import("./pages/beforecitychange/Ask02Page"),
        import("./pages/beforecitychange/Ask02_2Page"),
        import("./pages/beforecitychange/Ask04Page"),
        import("./pages/beforecitychange/Ask04BudgetPage"),
        import("./pages/beforecitychange/Ask05Page"),
        import("./pages/beforecitychange/FakeNewsPage"),
        import("./pages/beforecitychange/SourceSelectionPage"),
        import("./pages/beforecitychange/BudgetPage"),
        import("./pages/beforecitychange/EndSequencePage"),
        import("./pages/beforecitychange/EndScreenPage"),
        import("./pages/beforecitychange/MiniGameMN1Page"),
        import("./pages/beforecitychange/MiniGameMN2Page"),
        import("./pages/beforecitychange/MiniGameMN01Page"),
        import("./pages/beforecitychange/MiniGameMN3Page"),
        import("./pages/beforecitychange/HowDoYouThinkPage"),
      ];
      Promise.allSettled(tasks);
    };
    if (typeof (window as any).requestIdleCallback === "function") {
      (window as any).requestIdleCallback(preload);
    } else {
      setTimeout(preload, 1000);
    }
  }, []);

  // Global handlers to prevent unhandled promise rejections and unexpected fetch errors
  useEffect(() => {
    const onUnhandledRejection = (e: PromiseRejectionEvent) => {
      try {
        console.warn("Unhandled promise rejection:", e.reason);
        // prevent the browser default (spam) if possible
        if (e && typeof e.preventDefault === "function") e.preventDefault();
      } catch (_) {}
    };
    const onError = (ev: ErrorEvent) => {
      try {
        console.warn("Global error:", ev.error || ev.message);
      } catch (_) {}
    };
    window.addEventListener("unhandledrejection", onUnhandledRejection as any);
    window.addEventListener("error", onError as any);
    return () => {
      window.removeEventListener(
        "unhandledrejection",
        onUnhandledRejection as any,
      );
      window.removeEventListener("error", onError as any);
    };
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<SuspenseFallback />}>
          {/* Smooth client-side route transitions handled inside TabletMockup for ukpack2 */}
          <ErrorBoundary>
            <BusDesignProvider>
              <Routes>
                {/* Main entry */}
                <Route path="/" element={<IndexPage />} />
                <Route
                  path="/beforecitychange"
                  element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <UkStornaway />
                    </Suspense>
                  }
                />
                <Route path="/mydreambus" element={<SplashScreen />} />
                <Route path="/mydreambus/pdpa" element={<PdpaScreen />} />
                <Route
                  path="/mydreambus/dashboard"
                  element={<UkPack2Dashboard />}
                />
                <Route path="/mydreambus/ukpact2-dashboard" element={<Navigate to="/mydreambus/dashboard" replace />} />
                <Route path="/mydreambus/chassis" element={<ChassisScreen />} />
                <Route path="/mydreambus/seating" element={<SeatingScreen />} />
                <Route
                  path="/mydreambus/amenities"
                  element={<AmenitiesScreen />}
                />
                <Route path="/mydreambus/payment" element={<PaymentScreen />} />
                <Route path="/mydreambus/doors" element={<DoorScreen />} />
                <Route path="/mydreambus/design" element={<DesignScreen />} />
                <Route path="/mydreambus/summary" element={<SummaryScreen />} />
                <Route path="/mydreambus/info" element={<InfoScreen />} />
                <Route
                  path="/mydreambus/info-next"
                  element={<InfoNextScreen />}
                />
                <Route
                  path="/mydreambus/feedback"
                  element={<FeedbackScreen />}
                />
                <Route
                  path="/mydreambus/feedback-skip"
                  element={<FeedbackSkipScreen />}
                />
                <Route path="/mydreambus/submit" element={<SubmitScreen />} />
                <Route
                  path="/mydreambus/thank-you"
                  element={<ThankYouScreen />}
                />
                <Route path="/mydreambus/form" element={<FormScreen />} />
                <Route
                  path="/mydreambus/confirmation"
                  element={<ConfirmationScreen />}
                />
                <Route path="/mydreambus/end" element={<EndScreen />} />
                <Route path="/mydreambus/skip-end" element={<SkipEndPage />} />

                {/* Survey (Ask01 removed) */}
                <Route
                  path="/beforecitychange/ask02"
                  element={
                    <Suspense fallback={<AskSkeleton />}>
                      <Ask02Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/ask02-2"
                  element={
                    <Suspense fallback={<AskSkeleton />}>
                      <Ask02_2Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/ask04"
                  element={
                    <Suspense fallback={<AskSkeleton />}>
                      <Ask04Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/ask04-budget"
                  element={
                    <Suspense fallback={<AskSkeleton />}>
                      <Ask04BudgetPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/ask05"
                  element={
                    <Suspense fallback={<AskSkeleton />}>
                      <Ask05Page />
                    </Suspense>
                  }
                />

                {/* Other pages */}
                <Route
                  path="/beforecitychange/fake-news"
                  element={
                    <Suspense fallback={<FakeNewsSkeleton />}>
                      <FakeNewsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/source-selection"
                  element={
                    <Suspense fallback={<SourceSelectionSkeleton />}>
                      <SourceSelectionPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/budget"
                  element={
                    <Suspense fallback={<BudgetSkeleton />}>
                      <BudgetPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/end-sequence"
                  element={
                    <Suspense fallback={<EndSequenceSkeleton />}>
                      <EndSequencePage />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/end-screen"
                  element={
                    <Suspense fallback={<EndScreenSkeleton />}>
                      <EndScreenPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/minigame-mn1"
                  element={
                    <Suspense fallback={<MN3Skeleton />}>
                      <MiniGameMN01Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/minigame-mn1-backup"
                  element={
                    <Suspense fallback={<MN3Skeleton />}>
                      <MiniGameMN1Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/minigame-mn2"
                  element={
                    <Suspense fallback={<MN3Skeleton />}>
                      <MiniGameMN2Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/minigame-mn3"
                  element={
                    <Suspense fallback={<MN3Skeleton />}>
                      <MiniGameMN3Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/uk-stornaway"
                  element={<Navigate to="/beforecitychange" replace />}
                />
                <Route
                  path="/beforecitychange/Uk-stornaway"
                  element={<Navigate to="/beforecitychange" replace />}
                />
                <Route
                  path="/beforecitychange/reason-other-01"
                  element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <ReasonOther01Page />
                    </Suspense>
                  }
                />
                <Route
                  path="/beforecitychange/what-do-you-travel-by"
                  element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <WhatDoYouTravelByPage />
                    </Suspense>
                  }
                />
                {/* Canonical beforecitychange dashboard route */}
                <Route
                  path="/beforecitychange/ukdashboard"
                  element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <UkDashboard />
                    </Suspense>
                  }
                />
                {/* Redirect legacy/variant dashboard URLs to canonical */}
                <Route path="/beforecitychange/ukdashboard.html" element={<Navigate to="/beforecitychange/ukdashboard" replace />} />
                <Route path="/beforecitychange/uk-dashboard" element={<Navigate to="/beforecitychange/ukdashboard" replace />} />
                <Route path="/beforecitychange/UkDashboard" element={<Navigate to="/beforecitychange/ukdashboard" replace />} />
                <Route path="/beforecitychange/ukpact1-dashboard" element={<Navigate to="/beforecitychange/ukdashboard" replace />} />
                <Route
                  path="/beforecitychange/how-do-you-think"
                  element={
                    <Suspense fallback={<AskSkeleton />}>
                      <HowDoYouThinkPage />
                    </Suspense>
                  }
                />

                {/* Legacy alias routes (cleaned) */}
                <Route
                  path="/Ask02Page"
                  element={<Navigate to="/beforecitychange/ask02" replace />}
                />
                <Route
                  path="/beforecitychange/Ask02Page"
                  element={<Navigate to="/beforecitychange/ask02" replace />}
                />
                <Route
                  path="/Ask02_2Page"
                  element={<Navigate to="/beforecitychange/ask02-2" replace />}
                />
                <Route
                  path="/beforecitychange/Ask02_2Page"
                  element={<Navigate to="/beforecitychange/ask02-2" replace />}
                />
                <Route
                  path="/Ask04Page"
                  element={<Navigate to="/beforecitychange/ask04" replace />}
                />
                <Route
                  path="/beforecitychange/Ask04Page"
                  element={<Navigate to="/beforecitychange/ask04" replace />}
                />
                <Route
                  path="/Ask04BudgetPage"
                  element={
                    <Navigate to="/beforecitychange/ask04-budget" replace />
                  }
                />
                <Route
                  path="/Ask05Page"
                  element={<Navigate to="/beforecitychange/ask05" replace />}
                />
                <Route
                  path="/beforecitychange/Ask05Page"
                  element={<Navigate to="/beforecitychange/ask05" replace />}
                />
                <Route
                  path="/BudgetPage"
                  element={<Navigate to="/beforecitychange/budget" replace />}
                />
                <Route
                  path="/beforecitychange/BudgetPage"
                  element={<Navigate to="/beforecitychange/budget" replace />}
                />
                <Route
                  path="/FakeNewsPage"
                  element={
                    <Navigate to="/beforecitychange/fake-news" replace />
                  }
                />
                <Route
                  path="/SourceSelectionPage"
                  element={
                    <Navigate to="/beforecitychange/source-selection" replace />
                  }
                />
                <Route
                  path="/beforecitychange/SourceSelection"
                  element={
                    <Navigate to="/beforecitychange/source-selection" replace />
                  }
                />
                <Route
                  path="/SourceSelection"
                  element={
                    <Navigate to="/beforecitychange/source-selection" replace />
                  }
                />
                <Route
                  path="/EndSequencePage"
                  element={
                    <Navigate to="/beforecitychange/end-sequence" replace />
                  }
                />
                <Route
                  path="/beforecitychange/EndSequencePage"
                  element={
                    <Navigate to="/beforecitychange/end-sequence" replace />
                  }
                />
                <Route
                  path="/beforecitychange/Step1_Decision"
                  element={
                    <Navigate to="/beforecitychange/end-sequence" replace />
                  }
                />
                <Route
                  path="/Step1_Decision"
                  element={
                    <Navigate to="/beforecitychange/end-sequence" replace />
                  }
                />
                <Route
                  path="/EndScreenPage"
                  element={
                    <Navigate to="/beforecitychange/end-screen" replace />
                  }
                />
                <Route
                  path="/MiniGameMN01Page"
                  element={
                    <Navigate to="/beforecitychange/minigame-mn1" replace />
                  }
                />
                <Route
                  path="/MiniGameMN1Page"
                  element={
                    <Navigate to="/beforecitychange/minigame-mn1" replace />
                  }
                />
                <Route
                  path="/MiniGameMN2Page"
                  element={
                    <Navigate to="/beforecitychange/minigame-mn2" replace />
                  }
                />
                <Route
                  path="/MiniGameMN3Page"
                  element={
                    <Navigate to="/beforecitychange/minigame-mn3" replace />
                  }
                />
                <Route
                  path="/beforecitychange/MiniGameMN3Page"
                  element={
                    <Navigate to="/beforecitychange/minigame-mn3" replace />
                  }
                />
                <Route
                  path="/UkStornawayPage"
                  element={<Navigate to="/beforecitychange" replace />}
                />
                {/* Root-level legacy aliases for Stornaway */}
                <Route
                  path="/Uk-stornaway"
                  element={<Navigate to="/beforecitychange" replace />}
                />
                <Route
                  path="/uk-stornaway"
                  element={<Navigate to="/beforecitychange" replace />}
                />
                {/* Legacy aliases for ReasonOther01 */}
                <Route
                  path="/beforecitychange/ReasonOther01Page"
                  element={
                    <Navigate to="/beforecitychange/reason-other-01" replace />
                  }
                />
                <Route
                  path="/ReasonOther01Page"
                  element={
                    <Navigate to="/beforecitychange/reason-other-01" replace />
                  }
                />
                {/* Legacy aliases for WhatDoYouTravelBy */}
                <Route
                  path="/beforecitychange/WhatDoYouTravelByPage"
                  element={
                    <Navigate
                      to="/beforecitychange/what-do-you-travel-by"
                      replace
                    />
                  }
                />
                <Route
                  path="/WhatDoYouTravelByPage"
                  element={
                    <Navigate
                      to="/beforecitychange/what-do-you-travel-by"
                      replace
                    />
                  }
                />

                {/* Legacy dashboard aliases */}
                <Route path="/ukdashboard" element={<Navigate to="/beforecitychange/ukdashboard" replace />} />
                <Route path="/UkDashboard" element={<Navigate to="/beforecitychange/ukdashboard" replace />} />

                {/* 404 page */}
                <Route path="/ukpack2/*" element={<RedirectUkpack2 />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BusDesignProvider>
          </ErrorBoundary>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
