import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import RouteTransition from "../../../components/shared/RouteTransition.ukpack1";
import React, { useEffect, useRef, useState, useCallback } from "react";

interface DesktopMockupProps {
  children: React.ReactNode;
}

const DesktopMockup: React.FC<DesktopMockupProps> = ({ children }) => {
  const [win, setWin] = useState<{ w: number; h: number }>(() => ({
    w: typeof window === "undefined" ? 0 : window.innerWidth,
    h: typeof window === "undefined" ? 0 : window.innerHeight,
  }));

  useEffect(() => {
    const onResize = () =>
      setWin({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const BASE_W = 414; // iPhone XR CSS points (portrait)
  const BASE_H = 896;
  const [scale, setScale] = useState(1);
  const [initialized, setInitialized] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const viewportBackground = "#ffffff";

  const recomputeScale = useCallback(() => {
    const margin = 32; // include soft shadow space
    const wv = Math.max(0, win.w - margin);
    const hv = Math.max(0, win.h - margin);
    const naturalW = BASE_W + 40;
    const naturalH = BASE_H + 40;
    const s = Math.min(wv / naturalW, hv / naturalH, 1);
    const minVisibleScale = 0.6;
    setScale(Math.max(s, minVisibleScale));
  }, [win.w, win.h]);

  useEffect(() => {
    recomputeScale();
  }, [recomputeScale]);

  useEffect(() => {
    const id = requestAnimationFrame(recomputeScale);
    return () => cancelAnimationFrame(id);
  }, [win.w, win.h, recomputeScale]);

  useEffect(() => {
    let mounted = true;
    const stabilize = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!mounted) return;
          try {
            recomputeScale();
          } catch (_) {}
          setInitialized(true);
        });
      });
    };
    const tid = window.setTimeout(stabilize, 60);
    return () => {
      mounted = false;
      clearTimeout(tid);
    };
  }, [recomputeScale]);

  const active = win.w >= 700;

  useEffect(() => {
    if (!active) return;
    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [active]);

  if (!active) return <>{children}</>;

  if (typeof document === "undefined") return <>{children}</>;

  const isMN1 = typeof location !== "undefined" && location.pathname && location.pathname.startsWith("/beforecitychange/minigame-mn1");
  const isMN2 = typeof location !== "undefined" && location.pathname && location.pathname.startsWith("/beforecitychange/minigame-mn2");

  const mockup = (
    <div
      className={`fixed inset-0 grid place-items-center w-screen h-screen ${isMN1 || isMN2 ? "bg-transparent" : "bg-neutral-100/40"} overflow-hidden`}
      style={{ zIndex: 2147483647, pointerEvents: "none" }}
    >
      <div
        ref={frameRef}
        className="relative"
        style={{
          width: `${BASE_W}px`,
          height: `${BASE_H}px`,
          transform: `scale(${initialized ? Math.max(scale, 0.6) : 1})`,
          transformOrigin: "center",
          maxWidth: "100vw",
          maxHeight: "100vh",
          transition: "none",
          visibility: "visible",
          pointerEvents: "auto",
        }}
        aria-label="desktop-mockup"
      >
        <div
          className="rounded-[48px] border-[2px] border-neutral-300 shadow-2xl drop-shadow-lg bg-neutral-200/60 p-2"
          style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
        >
          <div
            className="relative rounded-[40px] bg-neutral-900 p-1"
            style={{ width: "100%", height: "100%" }}
          >
            <div
              className="rounded-[30px] bg-white overflow-hidden tablet-mock-env"
              style={{
                position: "relative",
                width: `${BASE_W}px`,
                height: `${BASE_H}px`,
                aspectRatio: `${BASE_W} / ${BASE_H}`,
                pointerEvents: "auto",
                overflow: "hidden",
              }}
              onClickCapture={(e: React.MouseEvent) => {
                try {
                  if (e.button !== 0) return;
                  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
                  const tgt = e.target as HTMLElement | null;
                  if (!tgt) return;
                  const a = tgt.closest("a") as HTMLAnchorElement | null;
                  if (!a) return;
                  const href = a.getAttribute("href");
                  if (!href) return;
                  const target = a.getAttribute("target");
                  if (target && target !== "_self") return;

                  let url: URL | null = null;
                  try {
                    url = new URL(href, window.location.href);
                  } catch {
                    url = null;
                  }
                  if (url) {
                    if (url.origin !== window.location.origin) return;
                    if (!url.pathname.startsWith("/beforecitychange")) return;
                    e.preventDefault();
                    navigate(url.pathname + url.search + url.hash);
                  } else {
                  }
                } catch (err) {}
              }}
            >
              {/* For MN2, render content inside an iframe and portal children into it so the mock matches mobile.
                  Scoped to isMN2 to avoid affecting other pages. */}
              {isMN2 ? (
                <>
                  <iframe
                    ref={iframeRef}
                    title="mn2-desktop-mock-iframe"
                    sandbox="allow-same-origin allow-scripts allow-forms"
                    style={{
                      width: `${BASE_W}px`,
                      height: `${BASE_H}px`,
                      border: "0",
                      borderRadius: 30,
                      display: "block",
                    }}
                  />

                  {iframeMount
                    ? createPortal(<RouteTransition>{children}</RouteTransition>, iframeMount)
                    : (
                      // While iframe initializes, keep hidden RouteTransition to avoid layout shift
                      <div style={{ visibility: "hidden" }}>
                        <RouteTransition>{children}</RouteTransition>
                      </div>
                    )}
                </>
              ) : (
                <RouteTransition>{children}</RouteTransition>
              )}
            </div>

            <div
              style={{
                position: "absolute",
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
                height: 6,
                width: 112,
                borderRadius: 999,
                background: "#e5e7eb",
                opacity: 0.6,
              }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(mockup, document.body);
};

export default DesktopMockup;
