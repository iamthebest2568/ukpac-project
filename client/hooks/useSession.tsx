/**
 * Session Management Hook
 * Manages session ID, user journey data, and flow data across the application
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { logEvent } from "../services/dataLogger.js";

interface UseSessionReturn {
  sessionID: string;
  userJourneyData: any;
  flowData: any;
  setUserJourneyData: (data: any) => void;
  setFlowData: (data: any) => void;
  navigateToPage: (path: string, data?: any) => void;
}

export const useSession = (): UseSessionReturn => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessionID, setSessionID] = useState<string>("");
  const [userJourneyData, setUserJourneyData] = useState<any>({});
  const [flowData, setFlowData] = useState<any>(() => {
    // Initialize flowData from sessionStorage if available
    try {
      const stored = sessionStorage.getItem("flowData");
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error loading flowData from sessionStorage:", error);
      return {};
    }
  });

  useEffect(() => {
    // Get or create canonical session ID shared across all pages
    const sessionIDParam = searchParams.get("sessionID");
    let sid: string | null = null;
    try {
      sid = sessionIDParam || sessionStorage.getItem("ukPackSessionID");
    } catch {
      sid = sessionIDParam || null;
    }
    if (!sid)
      sid = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    setSessionID(sid);
    try {
      sessionStorage.setItem("ukPackSessionID", sid);
    } catch {}

    // Log page navigation
    logEvent({
      event: "PAGE_NAVIGATION",
      payload: {
        page: window.location.pathname,
        url: window.location.href,
        referrer: document.referrer,
        sessionID: sid,
      },
    });
  }, [searchParams]);

  const navigateToPage = (path: string, data?: any) => {
    // Route translation for legacy compatibility
    const routeMap: Record<string, string> = {
      ask01: "/ask02",
      ask02: "/ask02",
      ask02_2: "/ask02-2",
      ask04: "/ask04",
      ask04_budget: "/ask04-budget",
      ask05: "/ask05",
      uk_stornaway: "/uk-stornaway",
      Flow_MiniGame_MN1: "/minigame-mn1",
      Flow_MiniGame_MN2: "/minigame-mn2",
      Flow_MiniGame_MN3: "/minigame-mn3",
      Flow_EndSequence: "/end-sequence",
      fakeNews: "/fake-news",
      sourceSelection: "/source-selection",
      budget: "/budget",
      endScreen: "/end-screen",
      index: "/",
      priorities: "/minigame-mn1", // Legacy alias
      beneficiaries: "/minigame-mn2", // Legacy alias
      reason_other_01: "/reason-other-01",
      what_do_you_travel_by: "/what-do-you-travel-by",
    };

    if (data) {
      setUserJourneyData((prev) => ({
        ...prev,
        [window.location.pathname]: data,
      }));

      // Log screen navigation
      logEvent({
        event: "SCREEN_NAVIGATION",
        payload: {
          fromPage: window.location.pathname,
          toPage: path,
          data,
          sessionID,
        },
      });
    }

    // Translate legacy routes to new paths
    let newPath = routeMap[path] || path;

    // If the path is absolute and not already under /beforecitychange, prefix it so all internal navigation
    // points to the beforecitychange project paths.
    if (
      typeof newPath === "string" &&
      newPath.startsWith("/") &&
      !newPath.startsWith("/beforecitychange")
    ) {
      newPath = `/beforecitychange${newPath}`;
    }

    // Navigate with session ID
    const searchParams = new URLSearchParams();
    if (sessionID) {
      searchParams.set("sessionID", sessionID);
    }
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${newPath}?${queryString}` : newPath;

    navigate(fullPath);
  };

  const enhancedSetFlowData = (data: any) => {
    if (typeof data === "function") {
      setFlowData((prev) => {
        const result = data(prev);
        // Persist to sessionStorage
        try {
          sessionStorage.setItem("flowData", JSON.stringify(result));
        } catch (error) {
          console.error("Error saving flowData to sessionStorage:", error);
        }
        return result;
      });
    } else {
      setFlowData(data);
      // Persist to sessionStorage
      try {
        sessionStorage.setItem("flowData", JSON.stringify(data));
      } catch (error) {
        console.error("Error saving flowData to sessionStorage:", error);
      }
    }
  };

  return {
    sessionID,
    userJourneyData,
    flowData,
    setUserJourneyData,
    setFlowData: enhancedSetFlowData,
    navigateToPage,
  };
};
