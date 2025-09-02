import React, { useEffect, useMemo, useRef, useState } from "react";

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
  const orderRef = useRef(0);
  const readyRef = useRef(false);
  const sessionId = useMemo(
    () => `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    [],
  );
  const [status, setStatus] = useState("รอการโต้ตอบจากผู้ใช้…");
  const [sessionData, setSessionData] = useState<SessionData>({ sessionId, events: [] });

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

  // Load API and attach listeners
  useEffect(() => {
    let mounted = true;

    function attachListeners() {
      if (!mounted || !iframeRef.current || readyRef.current) return;
      readyRef.current = true;
      setStatus("API เชื่อมต่อสำเร็จ! กำลังรอการโต้ตอบ…");

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
        setSessionData((prev) => ({ ...prev, events: [...prev.events, captured] }));
      };

      const storyStart = makeHandler("sw.story.start");
      const variantStart = makeHandler("sw.variant.start");
      const choiceSelected = makeHandler("sw.choice.selected");
      const storyEnd = makeHandler("sw.story.end");

      document.addEventListener("sw.story.start", storyStart as EventListener);
      document.addEventListener("sw.variant.start", variantStart as EventListener);
      document.addEventListener("sw.choice.selected", choiceSelected as EventListener);
      document.addEventListener("sw.story.end", storyEnd as EventListener);

      return () => {
        document.removeEventListener("sw.story.start", storyStart as EventListener);
        document.removeEventListener("sw.variant.start", variantStart as EventListener);
        document.removeEventListener("sw.choice.selected", choiceSelected as EventListener);
        document.removeEventListener("sw.story.end", storyEnd as EventListener);
      };
    }

    function initWithPlayer() {
      try {
        const g: any = (window as any).STORNAWAY;
        if (g && iframeRef.current) {
          // Initialize player instance (even if not used later)
          try { g.getPlayer(iframeRef.current); } catch {}
        }
      } catch {}
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
    <div className="min-h-screen bg-[#121212] text-white flex justify-center font-[Prompt]">
      <div className="w-full max-w-[800px] p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">Stornaway Interactive</h1>
        {/* 16:9 iframe container */}
        <div className="relative w-full rounded-xl overflow-hidden bg-black shadow-lg" style={{ paddingBottom: "56.25%" }}>
          <iframe
            ref={iframeRef}
            id="stornaway-player-1"
            src="https://player.stornaway.io/embed/837c8504"
            title="ความลับในมือถือ���่อ - Interactive Video"
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; clipboard-write; accelerometer; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Dashboard card */}
        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
          <h2 className="text-xl font-medium">แดชบอร์ดวิเคราะห์ข้อมูล</h2>
          <p className="text-sm text-white/70 mt-1">เข้าดูสถิติการใช้งานและบันทึกเหตุการณ์ของผู้ชมแบบเรียลไทม์</p>
          <button
            onClick={() => window.open(`${window.location.origin}/ukdashboard.html`, "_blank", "noopener")}
            className="mt-3 inline-flex items-center justify-center rounded-full bg-[#EFBA31] text-black font-medium px-5 py-2 border border-black hover:scale-105 transition"
          >
            เปิดแดชบอร์ด
          </button>
        </div>

        {/* Live log */}
        <div className="mt-6">
          <div className="text-lg font-medium mb-2">📝 ข้อมูลที่ถูกดักจับ (Live Log):</div>
          <pre className="max-h-[300px] overflow-auto text-sm p-3 rounded bg-black/60 text-[#d6deeb]">
{JSON.stringify(sessionData, null, 2)}
          </pre>
          <div className="mt-2 text-sm text-white/70">{status}</div>
        </div>
      </div>
    </div>
  );
}
