/**
 * Session Management Hook
 * Manages session ID, user journey data, and flow data across the application
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { logEvent } from '../services/dataLogger.js';

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
  const [sessionID, setSessionID] = useState<string>('');
  const [userJourneyData, setUserJourneyData] = useState<any>({});
  const [flowData, setFlowData] = useState<any>({});

  useEffect(() => {
    // Get or create session ID
    const sessionIDParam = searchParams.get('sessionID');
    const newSessionID = sessionIDParam || `session_${Date.now()}`;
    setSessionID(newSessionID);

    // Log page navigation
    logEvent({
      event: 'PAGE_NAVIGATION',
      payload: {
        page: window.location.pathname,
        url: window.location.href,
        referrer: document.referrer,
        sessionID: newSessionID
      }
    });
  }, [searchParams]);

  const navigateToPage = (path: string, data?: any) => {
    if (data) {
      setUserJourneyData(prev => ({ ...prev, [window.location.pathname]: data }));

      // Log screen navigation
      logEvent({
        event: 'SCREEN_NAVIGATION',
        payload: {
          fromPage: window.location.pathname,
          toPage: path,
          data,
          sessionID
        }
      });
    }

    // Navigate with session ID
    const searchParams = new URLSearchParams();
    if (sessionID) {
      searchParams.set('sessionID', sessionID);
    }
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${path}?${queryString}` : path;
    
    navigate(fullPath);
  };

  return {
    sessionID,
    userJourneyData,
    flowData,
    setUserJourneyData,
    setFlowData,
    navigateToPage
  };
};
