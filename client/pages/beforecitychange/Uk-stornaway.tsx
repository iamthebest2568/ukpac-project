import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSession } from "../../hooks/useSession";

// Data models
interface CapturedEvent {
  order: number;
  eventName: string;
  choiceText?: string;
  variantId?: string | number;
  variantName?: string;
  timestamp: string;
}

interface SessionData {
  sessionId: string;
  events: CapturedEvent[];
}

const STORAGE_KEY = "ukPackEvents";

function readSessions(): SessionData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as SessionData[];
    if (parsed && Array.isArray(parsed.sessions)) return parsed.sessions as SessionData[];
    return [];
  } catch {
    return [];
  }
}

function writeSessions(sessions: SessionData[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // ignore
  }
}

export default function UkStornaway() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null);
  const navigatedRef = useRef(false);
  const { sessionID, navigateToPage } = useSession();
  // Prevent automatic navigation from video choices to other app pages.
  // Choices remain within the video; navigation will be enabled later if needed.
  const preventExternalNavigation = true;
  const orderRef = useRef(0);
  const readyRef = useRef(false);
  const sessionId = useMemo(() => {
    try {
      const sid = sessionStorage.getItem("ukPackSessionID");
      if (sid) return sid;
    } catch {}
    if (sessionID) return sessionID;
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, [sessionID]);
  const [status, setStatus] = useState("รอการโต้ตอบจากผู้ใช้…");
  const [sessionData, setSessionData] = useState<SessionData>({ sessionId, events: [] });
  const eventsRef = useRef<CapturedEvent[]>([]);
  const updateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist on every change
  useEffect(() => {
    const existing = readSessions();
    const idx = existing.findIndex((s) => s.sessionId === sessionId);
    if (idx >= 0) existing[idx] = sessionData;
    else existing.push(sessionData);
    writeSessions(existing);
  }, [sessionData.events, sessionId]);

  // Persist once more on unmount
  useEffect(() => {
    return () => {
      const existing = readSessions();
      const idx = existing.findIndex((s) => s.sessionId === sessionId);
      if (idx >= 0) existing[idx] = sessionData;
      else existing.push(sessionData);
      writeSessions(existing);
    };
  }, [sessionData, sessionId]);

  // Helper to send event to backend
  async function sendToBackend(ev: CapturedEvent) {
    try {
      await fetch("/api/video-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ev, sessionId }),
      });
    } catch {
      // ignore network errors in UI
    }
  }

  // Load API and attach listeners
  useEffect(() => {
    let mounted = true;
    // Prefetch next pages for instant navigation
    import("./ReasonOther01Page").catch(() => {});
    import("./WhatDoYouTravelByPage").catch(() => {});

    function attachListeners() {
      if (!mounted || !iframeRef.current || readyRef.current) return;
      readyRef.current = true;
      setStatus("API เชื่อมต่อสำเร็จ! กำลังรอการโต้ตอบ…");

      const makeHandler = (eventName: string) => (ev: Event) => {
        const detail: any = (ev as any).detail || {};
        const captured: CapturedEvent = {
          order: ++orderRef.current,
          eventName,
          choiceText: detail.choiceText ?? detail.text ?? detail.choice?.text ?? detail.choice?.label ?? detail.label,
          variantId: detail.variantId ?? detail.id ?? detail.variant?.id,
          variantName: detail.variantName ?? detail.name ?? detail.variant?.name,
          timestamp: new Date().toISOString(),
        };
        // throttle UI updates
        if (eventsRef.current.length === 0) {
          eventsRef.current = [...sessionData.events, captured];
        } else {
          eventsRef.current.push(captured);
        }
        if (!updateTimer.current) {
          updateTimer.current = setTimeout(() => {
            updateTimer.current = null;
            setSessionData((prev) => ({ ...prev, events: [...eventsRef.current] }));
          }, 250);
        }
        // send in background (beacon if available)
        try {
          const payload = { ...captured, sessionId } as any;
          if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
            navigator.sendBeacon("/api/video-events", blob);
          } else {
            setTimeout(() => {
              sendToBackend(captured);
            }, 0);
          }
        } catch {
          setTimeout(() => {
            sendToBackend(captured);
          }, 0);
        }

        if (eventName === "sw.choice.selected") {
          // Allow in-app navigation for special choices/tokens
          const token = (captured.choiceText || captured.variantName || "").trim();
          // 1) Explicit mappings for Thai labels
          if (token === "อื่น ๆ") {
            if (!navigatedRef.current) {
              navigatedRef.current = true;
              setTimeout(() => {
                // Navigate to Ask02_2 (ask02-2) flow instead of Ask02
                navigateToPage("ask02_2", { from: "stornaway", choice: token });
              }, 50);
            }
            return;
          }
          if (token === "นโยบายไม่ครอบคลุม") {
            if (!navigatedRef.current) {
              navigatedRef.current = true;
              setTimeout(() => {
                navigateToPage("Flow_MiniGame_MN1", { from: "stornaway", choice: token });
              }, 50);
            }
            return;
          }
          if (token === "เก็บไปก็ไม่มีอะไรดีขึ้น") {
            if (!navigatedRef.current) {
              navigatedRef.current = true;
              setTimeout(() => {
                navigateToPage("Flow_MiniGame_MN3", { from: "stornaway", choice: token });
              }, 50);
            }
            return;
          }
          if (token === "เห็นด้วย") {
            if (!navigatedRef.current) {
              navigatedRef.current = true;
              setTimeout(() => {
                navigateToPage("fakeNews", { from: "stornaway", choice: token });
              }, 50);
            }
            return;
          }
          if (token === "ไปต่อ" || token === "ไปต่อ.") {
            if (!navigatedRef.current) {
              navigatedRef.current = true;
              setTimeout(() => {
                // Navigate first to travel method page, then continue to opinion page from there
                navigateToPage("/what-do-you-travel-by", { from: "stornaway", choice: token });
              }, 50);
            }
            return;
          }
          // Route tokens disabled per request
          // Otherwise, do not navigate away (stay inside the video)
          if (!preventExternalNavigation) {
            if (!navigatedRef.current) {
              navigatedRef.current = true;
              setTimeout(() => {
                navigateToPage("ask01", { from: "stornaway", choice: captured.choiceText, variant: captured.variantName });
              }, 150);
            }
          }
        }
      };

      const storyStart = makeHandler("sw.story.start");
      const variantStart = makeHandler("sw.variant.start");
      const choiceSelected = makeHandler("sw.choice.selected");
      const storyEnd = makeHandler("sw.story.end");
      const storyComplete = makeHandler("sw.story.complete");
      const mediaPlay = makeHandler("sw.media.play");
      const mediaPause = makeHandler("sw.media.pause");

      document.addEventListener("sw.story.start", storyStart as EventListener);
      document.addEventListener("sw.variant.start", variantStart as EventListener);
      document.addEventListener("sw.choice.selected", choiceSelected as EventListener);
      document.addEventListener("sw.story.end", storyEnd as EventListener);
      document.addEventListener("sw.story.complete", storyComplete as EventListener);
      document.addEventListener("sw.media.play", mediaPlay as EventListener);
      document.addEventListener("sw.media.pause", mediaPause as EventListener);

      return () => {
        document.removeEventListener("sw.story.start", storyStart as EventListener);
        document.removeEventListener("sw.variant.start", variantStart as EventListener);
        document.removeEventListener("sw.choice.selected", choiceSelected as EventListener);
        document.removeEventListener("sw.story.end", storyEnd as EventListener);
        document.removeEventListener("sw.story.complete", storyComplete as EventListener);
        document.removeEventListener("sw.media.play", mediaPlay as EventListener);
        document.removeEventListener("sw.media.pause", mediaPause as EventListener);
      };
    }

    function initWithPlayer() {
      try {
        const g: any = (window as any).STORNAWAY;
        if (g && iframeRef.current) {
          try {
            playerRef.current = g.getPlayer(iframeRef.current);
          } catch {
            playerRef.current = null;
          }
        }
      } catch {
        playerRef.current = null;
      }
      return attachListeners();
    }

    function ensureScriptAndInit() {
      const existing = document.getElementById("stornaway-api-v1") as HTMLScriptElement | null;
      if (existing) {
        // If script already present and possibly loaded
        if ((window as any).STORNAWAY) {
          return initWithPlayer();
        }
        existing.addEventListener("load", initWithPlayer as any, { once: true } as any);
        return () => existing.removeEventListener("load", initWithPlayer as any);
      }
      const s = document.createElement("script");
      s.id = "stornaway-api-v1";
      s.src = "https://player.stornaway.io/embed/v1/player.js";
      s.async = true;
      s.onload = () => initWithPlayer();
      document.head.appendChild(s);
      return () => {
        s.onload = null;
      };
    }

    const cleanup = ensureScriptAndInit();
    return () => {
      mounted = false;
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black">
      <iframe
        ref={iframeRef}
        id="stornaway-player-1"
        src="https://player.stornaway.io/embed/e9fb79bb"
        title="Stornaway Interactive Video"
        className="absolute inset-0 w-full h-full"
        allow="autoplay; encrypted-media; clipboard-write; accelerometer; gyroscope; picture-in-picture; web-share; fullscreen"
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
