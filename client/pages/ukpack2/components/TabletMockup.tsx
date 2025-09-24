import React, { useEffect, useMemo, useState } from "react";

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
  const [viewport, setViewport] = useState<{ w: number; h: number; vw: number }>(() => {
    if (typeof window === "undefined") return { w: 0, h: 0, vw: 0 };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetW = 810;
    const targetH = 1080;
    const margin = 24; // breathing space around the mockup
    const availW = Math.max(0, vw - margin);
    const availH = Math.max(0, vh - margin);
    // maintain 3:4 ratio and fit within viewport
    let w = Math.min(targetW, availW);
    let h = Math.round((w * 4) / 3);
    if (h > availH) {
      h = availH;
      w = Math.round((h * 3) / 4);
    }
    return { w, h, vw };
  });

  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const targetW = 810;
      const targetH = 1080;
      const margin = 24;
      const availW = Math.max(0, vw - margin);
      const availH = Math.max(0, vh - margin);
      let w = Math.min(targetW, availW);
      let h = Math.round((w * 4) / 3);
      if (h > availH) {
        h = availH;
        w = Math.round((h * 3) / 4);
      }
      setViewport({ w, h, vw });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const active = viewport.vw >= 810;

  // Prevent body scrolling only when active
  useEffect(() => {
    if (!active) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [active]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center h-screen bg-neutral-100/60 overflow-hidden">
      <div className="relative max-w-[100vw] max-h-[100vh]">
        {/* Outer frame */}
        <div className="rounded-[40px] border border-neutral-300 shadow-2xl drop-shadow-lg bg-gradient-to-b from-neutral-200 to-neutral-100 p-2">
          {/* Inner bezel */}
          <div className="relative rounded-[32px] bg-neutral-900 p-2">
            {/* Top sensors (decorative) */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none" aria-hidden>
              <div className="h-1 w-16 rounded-full bg-neutral-700" />
              <div className="h-2 w-2 rounded-full bg-neutral-800 ring-2 ring-neutral-700" />
            </div>
            {/* Viewport */}
            <div
              className="rounded-[28px] bg-white overflow-auto"
              style={{ width: `${viewport.w}px`, height: `${viewport.h}px` }}
            >
              {children}
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
