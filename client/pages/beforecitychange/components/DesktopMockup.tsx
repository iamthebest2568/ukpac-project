import { useNavigate, useLocation } from "react-router-dom";
import RouteTransition from "../../../components/shared/RouteTransition.ukpack1";
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./mydreambus-desktop-mock.css";

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
  // Mockup-only background images for projects
  const beforecityBackgroundImage =
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F55e4304ca8d240debf36be140561839e?format=webp&width=800";
  const mydreambusBackgroundImage =
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff5a69d8442ba4f44a2bd091cbdcfad11?format=webp&width=800";

  const isBeforecity =
    typeof location !== "undefined" &&
    location.pathname &&
    location.pathname.startsWith("/beforecitychange");
  const isMydreambus =
    typeof location !== "undefined" &&
    location.pathname &&
    location.pathname.startsWith("/mydreambus");
  const mockupBackgroundImage = isMydreambus
    ? mydreambusBackgroundImage
    : isBeforecity
      ? beforecityBackgroundImage
      : null;

  const isMN1 =
    typeof location !== "undefined" &&
    location.pathname &&
    location.pathname.startsWith("/beforecitychange/minigame-mn1");
  const isMN2 =
    typeof location !== "undefined" &&
    location.pathname &&
    location.pathname.startsWith("/beforecitychange/minigame-mn2");
  const isMN3 =
    typeof location !== "undefined" &&
    location.pathname &&
    location.pathname.startsWith("/beforecitychange/minigame-mn3");
  const isAsk04Budget =
    typeof location !== "undefined" &&
    location.pathname &&
    location.pathname.startsWith("/beforecitychange/ask04-budget");

  // Removed iframe-based tablet mock; children will render directly inside the desktop mock frame.

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

  // Desktop-only alignment adjustment for mydreambus: ensure color mask overlay exactly matches
  // the rendered vehicle image within the vehicle-canvas. This observes image/container size and
  // writes inline styles to the overlay element so masks don't drift inside the desktop mockup.
  useEffect(() => {
    if (!isMydreambus) return;
    if (typeof document === "undefined") return;
    if (!frameRef.current) return;

    let raf = 0;
    const observers: ((() => void) | null)[] = [];

    const alignAll = () => {
      try {
        const root = frameRef.current as HTMLElement;
        const canvases = Array.from(root.querySelectorAll('.vehicle-canvas')) as HTMLElement[];
        canvases.forEach((vc) => {
          try {
            const img = vc.querySelector('img') as HTMLImageElement | null;
            const overlay = vc.querySelector('div[aria-hidden="true"]') as HTMLElement | null;
            if (!img || !overlay) return;

            const imgRect = img.getBoundingClientRect();
            const vcRect = vc.getBoundingClientRect();
            const leftPct = ((imgRect.left - vcRect.left) / vcRect.width) * 100;
            let topPct = ((imgRect.top - vcRect.top) / vcRect.height) * 100;
            const wPct = (imgRect.width / vcRect.width) * 100;
            const hPct = (imgRect.height / vcRect.height) * 100;

            // Read selected chassis from session storage (fall back safe)
            let selectedChassis: string | null = null;
            try {
              selectedChassis = sessionStorage.getItem('design.chassis');
            } catch (e) {
              selectedChassis = null;
            }

            // If medium (standard) chassis, nudge the overlay slightly upward to match visual
            // This corrects the observed vertical drift for the 'รถเมล์มาตรฐาน 30–50 ที่นั่ง'
            if (selectedChassis === 'medium') {
              // shift overlay up by 5 pixels; convert to percentage relative to the vc height
              try {
                const pxShift = 20; // pixels (5 + 15 requested)
                const shiftPct = (pxShift / vcRect.height) * 100;
                topPct = topPct - shiftPct;
              } catch (e) {
                // fallback to previous tuned percentage if any error
                topPct = topPct - 6;
              }
            }

            overlay.style.position = 'absolute';
            overlay.style.left = leftPct + '%';
            overlay.style.top = topPct + '%';
            overlay.style.width = wPct + '%';
            overlay.style.height = hPct + '%';
            overlay.style.transform = 'none';

            // set mask-size to fully cover the overlay (overlay dimensions already match the image)
            try {
              overlay.style.webkitMaskSize = '100% 100%';
            } catch (e) {}
            try {
              (overlay.style as any).maskSize = '100% 100%';
            } catch (e) {}
          } catch (e) {}
        });
      } catch (e) {}
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        alignAll();
      });
    };

    // align initially and on resize / image load
    schedule();

    const ro = (window as any).ResizeObserver ? new (window as any).ResizeObserver(schedule) : null;
    if (ro) {
      try {
        const root = frameRef.current as HTMLElement;
        const imgs = Array.from(root.querySelectorAll('.vehicle-canvas img')) as Element[];
        imgs.forEach((i) => ro.observe(i));
        ro.observe(root);
        observers.push(() => ro.disconnect());
      } catch (e) {}
    }

    window.addEventListener('resize', schedule);
    observers.push(() => window.removeEventListener('resize', schedule));

    return () => {
      cancelAnimationFrame(raf);
      observers.forEach((cb) => cb && cb());
    };
  }, [isMydreambus, initialized]);

  if (!active) return <>{children}</>;

  if (typeof document === "undefined") return <>{children}</>;

  const mockup = (
    <div
      className={`fixed inset-0 grid place-items-center w-screen h-screen overflow-hidden`}
      style={{
        zIndex: 2147483647,
        pointerEvents: "none",
        backgroundImage: `url(${mockupBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // keep slight overlay to ensure mockup frame is visible
        backgroundColor:
          isMN1 || isMN2 || isMN3 ? "transparent" : "rgba(255,255,255,0.06)",
      }}
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
              className={`rounded-[30px] bg-white overflow-hidden tablet-mock-env ${isMydreambus ? 'mydreambus-desktop-mock' : ''}` + "" + "" + ""}
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
              {/* For MN2/MN3, render content inside an iframe and portal children into it so the mock matches mobile.
                  Scoped to isMN2 or isMN3 to avoid affecting other pages. */}
              {/* Render content directly inside the desktop mock (no tablet iframe mock) */}
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

  // If mydreambus: render a simplified portal that mounts the page DOM exactly (mobile layout)
  if (isMydreambus) {
    const simple = (
      <div className={`fixed inset-0 grid place-items-center w-screen h-screen`} style={{ zIndex: 2147483647, pointerEvents: "none", backgroundColor: "transparent" }}>
        <div ref={frameRef} className="relative" style={{ width: `${BASE_W}px`, height: `${BASE_H}px`, transformOrigin: "center", maxWidth: "100vw", maxHeight: "100vh", transition: "none", visibility: "visible", pointerEvents: "auto" }} aria-label="desktop-mockup-mydreambus">
          <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
            <div className={`rounded-[30px] bg-white overflow-visible tablet-mock-env mydreambus-desktop-mock`} style={{ position: "relative", width: `${BASE_W}px`, height: `${BASE_H}px`, pointerEvents: "auto", overflow: "visible" }}>
              <RouteTransition>{children}</RouteTransition>
            </div>
          </div>
        </div>
      </div>
    );
    return createPortal(simple, document.body);
  }

  return createPortal(mockup, document.body);
};

export default DesktopMockup;
