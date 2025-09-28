import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import RouteTransition from "../../../components/shared/RouteTransition.ukpack1";

interface DesktopMockupProps {
  children: React.ReactNode;
}

/**
 * DesktopMockup for ukpack1
 * - Renders children normally when viewport < 810px
 * - When viewport >= 810px, centers a phone viewport (iPhone XR base) and prevents body scroll
 * - iPhone XR base viewport: 414 x 896 (portrait)
 */
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
    // Use BASE dimensions to avoid transient measurement issues caused by
    // fixed-position children or animated transitions in child content.
    const naturalW = BASE_W + 40;
    const naturalH = BASE_H + 40;
    const s = Math.min(wv / naturalW, hv / naturalH, 1);
    // Ensure the mockup never collapses to an extremely small size
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

  // Initial stabilization: run a delayed recompute after a couple frames to wait for
  // any layout/stylesheet operations to settle. This prevents transient tiny
  // measurements that collapse the mockup scale during reloads.
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
    // Small timeout to allow any font/layout shifts to finish
    const tid = window.setTimeout(stabilize, 60);
    return () => {
      mounted = false;
      clearTimeout(tid);
    };
  }, [recomputeScale]);

  // Show mockup on larger viewports; lower threshold slightly for preview environments
  const active = win.w >= 700;

  // Prevent body scrolling only when active (do not touch html element)
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

  const mockup = (
    <div
      className="fixed inset-0 grid place-items-center w-screen h-screen bg-neutral-100/40 overflow-hidden"
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
          {/* Inner bezel */}
          <div
            className="relative rounded-[40px] bg-neutral-900 p-1"
            style={{ width: "100%", height: "100%" }}
          >
            {/* Viewport (portrait 414x896) */}
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
                  // Only intercept left-clicks without modifier keys
                  if (e.button !== 0) return;
                  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
                  const tgt = e.target as HTMLElement | null;
                  if (!tgt) return;
                  const a = tgt.closest("a") as HTMLAnchorElement | null;
                  if (!a) return;
                  const href = a.getAttribute("href");
                  if (!href) return;
                  // Allow explicit targets (new tab) or download links
                  const target = a.getAttribute("target");
                  if (target && target !== "_self") return;

                  // If href is absolute, ensure same origin
                  let url: URL | null = null;
                  try {
                    url = new URL(href, window.location.href);
                  } catch {
                    url = null;
                  }
                  if (url) {
                    if (url.origin !== window.location.origin) return; // external
                    // Only intercept internal ukpack1 routes to keep mockup
                    if (!url.pathname.startsWith("/beforecitychange")) return;
                    e.preventDefault();
                    // Use react-router navigation to change route without full reload
                    navigate(url.pathname + url.search + url.hash);
                  } else {
                    // relative href without URL parseable? ignore
                  }
                } catch (err) {
                  // swallow
                }
              }}
            >
              <RouteTransition>{children}</RouteTransition>
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
