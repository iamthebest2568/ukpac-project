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
  const [width, setWidth] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return window.innerWidth;
  });

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const active = width >= 810;

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

  const viewportClass = useMemo(() => {
    if (width >= 1024) return "w-[900px] h-[1200px]";
    if (width >= 900) return "w-[810px] h-[1080px]";
    return "w-[768px] h-[1024px]";
  }, [width]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center h-screen bg-neutral-100/60">
      <div
        className={[
          viewportClass,
          "rounded-3xl border-2 border-neutral-300 shadow-2xl drop-shadow-lg bg-white overflow-auto",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
};

export default TabletMockup;
