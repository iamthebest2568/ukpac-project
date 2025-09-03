import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "../hooks/useSession";
import Ask01 from "../components/journey/Ask01";

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
  const { sessionID, navigateToPage } = useSession();
  const orderRef = useRef(0);
  const readyRef = useRef(false);
  const sessionId = useMemo(
    () => `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    [],
  );
  const [status, setStatus] = useState("รอการโต้ตอบจากผู้ใช้…");
  const [sessionData, setSessionData] = useState<SessionData>({ sessionId, events: [] });
  const eventsRef = useRef<CapturedEvent[]>([]);
  const updateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const hasShownPopupRef = useRef(false);
  const [showLiveLog, setShowLiveLog] = useState(false);

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
      setStatus("API เชื่อมต่อสำเร��จ! กำลังรอการโต้ตอบ…");

      const makeHandler = (eventName: string) => (ev: Event) => {
        if (ev.target !== iframeRef.current) return;
        const detail: any = (ev as any).detail || {};
        const captured: CapturedEvent = {
          order: ++orderRef.current,
          eventName,
          choiceText: detail.choiceText ?? detail.text ?? detail.choice?.text,
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
            setTimeout(() => { sendToBackend(captured); }, 0);
          }
        } catch {
          setTimeout(() => { sendToBackend(captured); }, 0);
        }

        if (eventName === "sw.variant.start") {
          const vName = (captured.variantName || "").toString().trim().toLowerCase();
          if (vName.includes("mini game 1")) {
            if (hasShownPopupRef.current) return;
            hasShownPopupRef.current = true;
            try { playerRef.current?.pause?.(); } catch {}
            setShowPopup(true);
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
          try { playerRef.current = g.getPlayer(iframeRef.current); } catch { playerRef.current = null; }
        }
      } catch { playerRef.current = null; }
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

    // Prefetch /ask01 route chunk for smoother popup
    import("../pages/Ask01Page").catch(() => {});

    const cleanup = ensureScriptAndInit();
    return () => {
      mounted = false;
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    if (showPopup) {
      document.body.style.overflow = "hidden";
      popupRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      t = setTimeout(() => {
        try { playerRef.current?.play?.(); } catch {}
      }, 150);
    }
    return () => {
      if (t) clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [showPopup]);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex justify-center font-[Prompt]">
      <div className="w-full max-w-[800px] p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">Stornaway Interactive</h1>
        {/* 16:9 iframe container */}
        <div className="relative w-full rounded-xl overflow-hidden bg-black shadow-lg" style={{ paddingBottom: "56.25%" }}>
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
          <p className="text-sm text-white/70 mt-1">เข้าดูสถิติการใช้งานและบันทึกเหตุการณ์ของผู้ชมแบบเรียลไทม์</p>
          <button
            onClick={() => window.open("https://0401efcf1cc14196acbc542ce39f187e-main.projects.builder.my/UkDashboard", "_blank", "noopener")}
            className="mt-3 inline-flex items-center justify-center rounded-full bg-[#EFBA31] text-black font-medium px-5 py-2 border border-black hover:scale-105 transition"
          >
            เปิดแดชบอร์ด
          </button>
        </div>

        {/* Live log */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-medium">📝 ข้อมูลที่ถูกดักจับ (Live Log)</div>
            <button
              onClick={() => setShowLiveLog((v) => !v)}
              className="text-sm px-3 py-1 rounded-full border border-white/20 hover:bg-white/10"
            >
              {showLiveLog ? "ซ่อน" : "แสดง"}
            </button>
          </div>
          {showLiveLog && (
            <pre className="max-h-[300px] overflow-auto text-sm p-3 rounded bg-black/60 text-[#d6deeb]">
{JSON.stringify(sessionData, null, 2)}
            </pre>
          )}
          <div className="mt-2 text-sm text-white/70">{status}</div>
        </div>
      </div>

      {showPopup && (
        <div
          className="fixed inset-0 z-[1000] bg-black/70 flex items-center justify-center p-4 transition-opacity duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="หน้าต่างป๊อปอัพแบบสอบถาม"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowPopup(false);
            }
          }}
          onTransitionEnd={() => { /* no-op for now */ }}
        >
          <div
            ref={popupRef}
            className="relative w-full max-w-3xl h-[80vh] bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden shadow-2xl transform transition-transform duration-200"
            tabIndex={-1}
          >
            <button
              onClick={() => {
                setShowPopup(false);
              }}
              className="absolute top-3 right-3 z-20 rounded-full bg-white/90 text-black px-3 py-1 text-sm font-medium hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#EFBA31]"
              aria-label="ปิดหน้าต่าง"
            >
              ปิด
            </button>
            <div className="w-full h-full overflow-auto bg-black">
              <Ask01
                sessionID={sessionID}
                onNavigate={(screenId, data) => {
                  setShowPopup(false);
                  // Navigate the main flow to keep full compatibility
                  navigateToPage(screenId, data);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
