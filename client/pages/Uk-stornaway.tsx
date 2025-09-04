import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "../hooks/useSession";

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
    if (parsed && Array.isArray(parsed.sessions))
      return parsed.sessions as SessionData[];
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
  const [sessionData, setSessionData] = useState<SessionData>({
    sessionId,
    events: [],
  });
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

    function attachListeners() {
      if (!mounted || !iframeRef.current || readyRef.current) return;
      readyRef.current = true;
      setStatus("API เชื่อมต่อสำเร็จ! กำลังรอการโต้ตอบ…");

      const makeHandler = (eventName: string) => (ev: Event) => {
        const detail: any = (ev as any).detail || {};
        const captured: CapturedEvent = {
          order: ++orderRef.current,
          eventName,
          choiceText:
            detail.choiceText ??
            detail.text ??
            detail.choice?.text ??
            detail.choice?.label ??
            detail.label,
          variantId: detail.variantId ?? detail.id ?? detail.variant?.id,
          variantName:
            detail.variantName ?? detail.name ?? detail.variant?.name,
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
            setSessionData((prev) => ({
              ...prev,
              events: [...eventsRef.current],
            }));
          }, 250);
        }
        // send in background (beacon if available)
        try {
          const payload = { ...captured, sessionId } as any;
          if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(payload)], {
              type: "application/json",
            });
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
          if (!navigatedRef.current) {
            navigatedRef.current = true;
            setTimeout(() => {
              navigateToPage("ask01", {
                from: "stornaway",
                choice: captured.choiceText,
                variant: captured.variantName,
              });
            }, 150);
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
      document.addEventListener(
        "sw.variant.start",
        variantStart as EventListener,
      );
      document.addEventListener(
        "sw.choice.selected",
        choiceSelected as EventListener,
      );
      document.addEventListener("sw.story.end", storyEnd as EventListener);
      document.addEventListener(
        "sw.story.complete",
        storyComplete as EventListener,
      );
      document.addEventListener("sw.media.play", mediaPlay as EventListener);
      document.addEventListener("sw.media.pause", mediaPause as EventListener);

      return () => {
        document.removeEventListener(
          "sw.story.start",
          storyStart as EventListener,
        );
        document.removeEventListener(
          "sw.variant.start",
          variantStart as EventListener,
        );
        document.removeEventListener(
          "sw.choice.selected",
          choiceSelected as EventListener,
        );
        document.removeEventListener("sw.story.end", storyEnd as EventListener);
        document.removeEventListener(
          "sw.story.complete",
          storyComplete as EventListener,
        );
        document.removeEventListener(
          "sw.media.play",
          mediaPlay as EventListener,
        );
        document.removeEventListener(
          "sw.media.pause",
          mediaPause as EventListener,
        );
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
      const existing = document.getElementById(
        "stornaway-api-v1",
      ) as HTMLScriptElement | null;
      if (existing) {
        // If script already present and possibly loaded
        if ((window as any).STORNAWAY) {
          return initWithPlayer();
        }
        existing.addEventListener(
          "load",
          initWithPlayer as any,
          { once: true } as any,
        );
        return () =>
          existing.removeEventListener("load", initWithPlayer as any);
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

    // Prefetch /ask01 route chunk for smoother popup
    import("../pages/Ask01Page").catch(() => {});

    const cleanup = ensureScriptAndInit();
    return () => {
      mounted = false;
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex justify-center font-[Prompt]">
      <div className="w-full max-w-[800px] p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">
          Stornaway Interactive
        </h1>
        {/* 16:9 iframe container */}
        <div
          className="relative w-full rounded-xl overflow-hidden bg-black shadow-lg"
          style={{ paddingBottom: "56.25%" }}
        >
          <iframe
            ref={iframeRef}
            id="stornaway-player-1"
            src="https://player.stornaway.io/embed/837c8504"
            title="ความลับในมือถือพ่อ - Interactive Video"
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; clipboard-write; accelerometer; gyroscope; picture-in-picture; web-share; fullscreen"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* Dashboard card */}
        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
          <h2 className="text-xl font-medium">แดชบอร์ดวิเคราะห์ข้อมูล</h2>
          <p className="text-sm text-white/70 mt-1">
            เข้าดูสถิติการใช้งานและบันทึกเหตุการณ์ของผู้ชมแบบเรียลไทม์
          </p>
          <button
            onClick={() =>
              window.open(
                "https://0401efcf1cc14196acbc542ce39f187e-main.projects.builder.my/UkDashboard",
                "_blank",
                "noopener",
              )
            }
            className="mt-3 inline-flex items-center justify-center rounded-full bg-[#EFBA31] text-black font-medium px-5 py-2 border border-black hover:scale-105 transition"
          >
            เปิดแดชบอร์ด
          </button>
        </div>
      </div>
    </div>
  );
}
