import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RouteTransition from "../../../components/shared/RouteTransition.ukpack1";

interface TabletMockupProps {
  children: React.ReactNode;
}

/**
 * DesktopMockup for ukpack1 (renamed from TabletMockup)
 * - Renders children normally when viewport < 810px
 * - When viewport >= 810px, centers a phone viewport (iPhone XR base) and prevents body scroll
 * - iPhone XR base viewport: 414 x 896 (portrait)
 */
const DesktopMockup: React.FC<TabletMockupProps> = ({ children }) => {
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
  const frameRef = React.useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isUk1MiniGameNoWhite =
    typeof location?.pathname === "string" &&
    (location.pathname.startsWith("/ukpack1/minigame-mn1") ||
      location.pathname.startsWith("/ukpack1/minigame-mn2"));

  const recomputeScale = React.useCallback(() => {
    const margin = 32; // include soft shadow space
    const wv = Math.max(0, win.w - margin);
    const hv = Math.max(0, win.h - margin);
    const node = frameRef.current;
    if (!node) return;
    // Temporarily reset transform to measure natural size
    const prev = node.style.transform;
    node.style.transform = "none";
    const rect = node.getBoundingClientRect();
    const naturalW = rect.width || BASE_W + 40;
    const naturalH = rect.height || BASE_H + 40;
    node.style.transform = prev;
    const s = Math.min(wv / naturalW, hv / naturalH, 1);
    setScale(s);
  }, [win.w, win.h]);

  React.useLayoutEffect(() => {
    recomputeScale();
  }, [recomputeScale]);

  useEffect(() => {
    const id = requestAnimationFrame(recomputeScale);
    return () => cancelAnimationFrame(id);
  }, [win.w, win.h, recomputeScale]);

  // keep same activation threshold as before: show mockup on larger viewports
  const active = win.w >= 810;

  // Prevent body scrolling only when active (do not touch html element)
  useEffect(() => {
    if (!active) return;
    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [active]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 grid place-items-center w-screen h-screen bg-neutral-100/60 overflow-hidden">
      <div
        ref={frameRef}
        className="relative"
        style={{
          width: `${BASE_W}px`,
          height: `${BASE_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center",
          maxWidth: "100vw",
          maxHeight: "100vh",
        }}
        aria-label="desktop-mockup"
      >
        {/* Outer phone frame */}
        <div
          className="rounded-[48px] border-[2px] border-neutral-300 shadow-2xl drop-shadow-lg bg-neutral-200/60 p-2"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Inner bezel */}
          <div
            className="relative rounded-[40px] bg-neutral-900 p-1"
            style={{ width: "100%", height: "100%" }}
          >
            {/* Viewport (portrait 414x896) */}
            <div
              className={`rounded-[30px] overflow-y-auto overflow-x-hidden tablet-mock-env ${isUk1MiniGameNoWhite ? '' : 'bg-white'}`}
              style={{
                position: "relative",
                width: `${BASE_W}px`,
                height: `${BASE_H}px`,
                aspectRatio: `${BASE_W} / ${BASE_H}`,
                backgroundColor: isUk1MiniGameNoWhite ? "transparent" : undefined,
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
                    if (!url.pathname.startsWith("/ukpack1")) return;
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

            {/* Bottom home indicator (iPhone gesture bar) */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 h-1.5 w-28 rounded-full bg-neutral-700/80"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopMockup;
