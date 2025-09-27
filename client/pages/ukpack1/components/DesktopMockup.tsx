import React, { useEffect, useState, useRef, useCallback } from "react";
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
    const onResize = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const BASE_W = 414; // iPhone XR CSS points (portrait)
  const BASE_H = 896;
  const [scale, setScale] = useState(1);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const viewportBackground = "#ffffff";

  const recomputeScale = useCallback(() => {
    const margin = 32; // include soft shadow space
    const wv = Math.max(0, win.w - margin);
    const hv = Math.max(0, win.h - margin);
    const node = frameRef.current;
    if (!node) return;
    const prev = node.style.transform;
    node.style.transform = "none";
    const rect = node.getBoundingClientRect();
    const naturalW = rect.width || BASE_W + 40;
    const naturalH = rect.height || BASE_H + 40;
    node.style.transform = prev;
    const s = Math.min(wv / naturalW, hv / naturalH, 1);
    setScale(s);
  }, [win.w, win.h]);

  useEffect(() => {
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

  if (!active) return <>{children}</>;

  return (
    <div className="fixed inset-0 grid place-items-center w-screen h-screen bg-transparent overflow-hidden">
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
        <div
          className="rounded-[20px] border-[1px] border-neutral-200 bg-transparent p-0"
          style={{ width: "100%", height: "100%", boxSizing: "border-box" }}
        >
          <div
            className="relative rounded-[16px] p-0"
            style={{ width: "100%", height: "100%", backgroundColor: viewportBackground }}
          >
            <div
              className={`rounded-[12px] overflow-y-auto overflow-x-hidden tablet-mock-env`}
              style={{
                position: "relative",
                width: `${BASE_W}px`,
                height: `${BASE_H}px`,
                aspectRatio: `${BASE_W} / ${BASE_H}`,
                backgroundColor: viewportBackground,
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
                    if (!url.pathname.startsWith("/ukpack1")) return;
                    e.preventDefault();
                    navigate(url.pathname + url.search + url.hash);
                  }
                } catch (err) {
                  // swallow
                }
              }}
            >
              <RouteTransition>{children}</RouteTransition>
            </div>

            <div
              style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", height: 6, width: 112, borderRadius: 999, background: "#e5e7eb", opacity: 0.6 }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopMockup;
