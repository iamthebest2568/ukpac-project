import React, { useEffect, useMemo, useState } from "react";
import RouteTransition from "../../../components/shared/RouteTransition";

interface TabletMockupProps {
  children: React.ReactNode;
}

/**
 * TabletMockup
 * - Renders children normally when viewport < 810px
 * - When viewport >= 810px, centers a scrollable tablet viewport and prevents body scroll
 * - Sizes (based on current window.innerWidth):
 *   - 810–899px  -> 768x1024
 *   - 900–1023px -> 810x1080
 *   - >=1024px   -> 900x1200
 */
const TabletMockup: React.FC<TabletMockupProps> = ({ children }) => {
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

  const BASE_W = 810; // viewport
  const BASE_H = 1080; // viewport
  const [scale, setScale] = useState(1);
  const frameRef = React.useRef<HTMLDivElement | null>(null);

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
          aspectRatio: "3 / 4",
          transform: `scale(${scale}) rotate(0deg)`,
          transformOrigin: "center",
          maxWidth: "100vw",
          maxHeight: "100vh",
        }}
        aria-label="tablet-mockup"
      >
        {/* Outer tablet frame (uniform thin bezel look) */}
        <div className="rounded-[32px] border-2 border-neutral-300 shadow-2xl drop-shadow-lg bg-neutral-200/60 p-2">
          {/* Inner bezel */}
          <div className="relative rounded-[26px] bg-neutral-900 p-2">
            {/* Top sensors (subtle, tablet-like) */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none" aria-hidden>
              <div className="h-[6px] w-16 rounded-full bg-neutral-700" />
              <div className="h-[8px] w-[8px] rounded-full bg-neutral-800 ring-2 ring-neutral-700" />
            </div>
            {/* Viewport (portrait 810x1080, no horizontal scroll) */}
            <div
              className="rounded-[22px] bg-white overflow-y-auto overflow-x-hidden tablet-mock-env"
              style={{ width: `${BASE_W}px`, height: `${BASE_H}px`, aspectRatio: "3 / 4", transform: "rotate(0deg)" }}
            >
              <RouteTransition>{children}</RouteTransition>
            </div>
            {/* Bottom gesture bar (decorative) */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-24 rounded-full bg-neutral-700/80" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabletMockup;
