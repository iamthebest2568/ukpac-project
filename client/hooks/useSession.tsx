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
      const stored = sessionStorage.getItem('flowData');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading flowData from sessionStorage:', error);
      return {};
    }
  });

  useEffect(() => {
    // Get or create session ID
    const sessionIDParam = searchParams.get("sessionID");
    const newSessionID = sessionIDParam || `session_${Date.now()}`;
    setSessionID(newSessionID);

    // Log page navigation
    logEvent({
      event: "PAGE_NAVIGATION",
      payload: {
        page: window.location.pathname,
        url: window.location.href,
        referrer: document.referrer,
        sessionID: newSessionID,
      },
    });
  }, [searchParams]);

  const navigateToPage = (path: string, data?: any) => {
    // Route translation for legacy compatibility
    const routeMap: Record<string, string> = {
      ask01: "/ask01",
      ask02: "/ask02",
      ask02_2: "/ask02-2",
      ask04: "/ask04",
      ask04_budget: "/ask04-budget",
      ask05: "/ask05",
      Flow_MiniGame_MN1: "/minigame-mn1",
      Flow_MiniGame_MN2: "/minigame-mn2",
      Flow_MiniGame_MN3: "/minigame-mn3",
      Flow_EndSequence: "/end-sequence",
      fakeNews: "/fake-news",
      sourceSelection: "/source-selection",
      budget: "/budget",
      endScreen: "/end-screen",
      dashboard: "/dashboard",
      index: "/",
      dashboardIndex: "/",
      videoIntro: "/video-intro",
      "video-intro": "/video-intro",
      priorities: "/minigame-mn1", // Legacy alias
      beneficiaries: "/minigame-mn2", // Legacy alias
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
    const newPath = routeMap[path] || path;

    // Navigate with session ID
    const searchParams = new URLSearchParams();
    if (sessionID) {
      searchParams.set("sessionID", sessionID);
    }
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${newPath}?${queryString}` : newPath;

    navigate(fullPath);
  };

  const debugSetFlowData = (data: any) => {
    console.log("=== useSession setFlowData ===");
    console.log("Setting flowData with:", data);
    if (typeof data === 'function') {
      setFlowData((prev) => {
        console.log("Previous flowData:", prev);
        const result = data(prev);
        console.log("New flowData:", result);
        return result;
      });
    } else {
      console.log("Direct flowData set:", data);
      setFlowData(data);
    }
    console.log("=== End useSession setFlowData ===");
  };

  return {
    sessionID,
    userJourneyData,
    flowData,
    setUserJourneyData,
    setFlowData: debugSetFlowData,
    navigateToPage,
  };
};
