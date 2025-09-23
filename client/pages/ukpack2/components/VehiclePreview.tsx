import React, { useRef, useEffect } from "react";

const SHADOW_URL =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb1e30b1544304677996b179fc27ae5c7?format=webp&width=800";

interface Props {
  imageSrc?: string | null;
  label?: string | React.ReactNode;
  overlayLabels?: string[];
  overlayIconMap?: Record<string, string | React.ReactNode>;
  placeholderText?: string;
  // optional color overlay props
  colorHex?: string | null; // e.g. "#ff0000"
  colorMaskSrc?: string | null; // mask image where masked area will be filled with colorHex
  // optional className to allow page-scoped padding/alignment
  className?: string;
  // when true, VehiclePreview will render a "รถที่เลือก : {label}" line beneath the preview
  showSelectedText?: boolean;
  // optional star icon to overlay on the top-right of the vehicle image
  starSrc?: string | null;
  showShadow?: boolean;
}

const VehiclePreview: React.FC<Props> = ({
  imageSrc,
  label,
  overlayLabels = [],
  overlayIconMap = {},
  placeholderText = "ภาพสำหรับรุ่นนี้จะถูกเพิ่มภายหลัง",
  colorHex = null,
  colorMaskSrc = null,
  className,
  showSelectedText = false,
  starSrc = null,
  showShadow = true,
}) => {
  const shadowRef = useRef<HTMLImageElement | null>(null);
  const carRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateShadow = () => {
    const carEl = carRef.current;
    const shadowEl = shadowRef.current;
    const containerEl = containerRef.current;
    if (!carEl || !containerEl) return;
    if (!shadowEl) return; // nothing to update when shadow disabled
    const carRect = carEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    const width = Math.round(carRect.width);
    // set width and center under car within container
    shadowEl.style.width = `${width}px`;
    shadowEl.style.left = `${carRect.left - containerRect.left + carRect.width / 2}px`;
    shadowEl.style.transform = `translateX(-50%)`;
  };

  // If a final design image has been persisted by the DesignScreen, prefer that
  // image for subsequent pages (Submit, Summary, End) so visuals remain consistent.
  const persistedFinal = (() => {
    try {
      const raw = sessionStorage.getItem("design.finalImage");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  })();

  const effectiveImageSrc = persistedFinal?.imageSrc || imageSrc;
  const effectiveColorHex = colorHex ?? persistedFinal?.color?.colorHex ?? null;
  const effectiveColorMaskSrc =
    colorMaskSrc || persistedFinal?.colorMaskSrc || null;
  const effectiveLabel =
    persistedFinal && persistedFinal.chassis && typeof label === "string"
      ? label
      : label;

  useEffect(() => {
    // update when imageSrc changes and on resize
    updateShadow();
    const onResize = () => updateShadow();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc]);

  return (
    <div
      className={`w-full rounded-md flex flex-col items-center justify-center gap-2 ${className || ""}`}
    >
      {effectiveImageSrc ? (
        <div
          className="relative w-full flex items-center justify-center"
          style={{ minHeight: "100px" }}
          ref={containerRef}
        >
          {showShadow && (
            <img
              ref={shadowRef}
              src={SHADOW_URL}
              alt=""
              className="absolute pointer-events-none select-none"
              style={{ bottom: "8px" }}
              decoding="async"
              loading="eager"
              aria-hidden="true"
            />
          )}

          <div
            className="relative w-[60%] sm:w-[65%] md:w-[70%] lg:w-[75%] max-w-[320px] sm:max-w-[380px] md:max-w-[480px]"
            style={{ height: "120px" }}
          >
            {overlayLabels &&
              overlayLabels.length > 0 &&
              (() => {
                // Allow stored overlay icon mappings (set by selection pages) to override
                // the overlayIconMap prop. Stored mapping is expected at
                // sessionStorage.design.overlayIconMap as { [label]: string }
                let storedMap: Record<string, string> = {};
                try {
                  const raw = sessionStorage.getItem("design.overlayIconMap");
                  if (raw)
                    storedMap = JSON.parse(raw) as Record<string, string>;
                } catch {}

                // Build a normalized lookup map to avoid mismatches from NBSP/no-break-hyphen or casing
                const normalizeKey = (s: string) =>
                  (s || "")
                    .replace(/\uFFFD/g, "")
                    .replace(/\u2011/g, "-")
                    .replace(/\u00A0/g, " ")
                    .replace(/&amp;/g, "&")
                    .replace(/\s+/g, " ")
                    .trim()
                    .toLowerCase();

                const normalizedStoredMap: Record<string, string> = {};
                try {
                  for (const k of Object.keys(storedMap || {})) {
                    try {
                      const nk = normalizeKey(k);
                      if (nk) normalizedStoredMap[nk] = storedMap[k];
                    } catch {}
                  }
                } catch {}

                // choose size classes based on selected chassis (stored in sessionStorage.design.chassis)
                const chassis = (() => {
                  try {
                    return (
                      sessionStorage.getItem("design.chassis") || undefined
                    );
                  } catch {
                    return undefined;
                  }
                })();
                const sizeClass = (() => {
                  switch (chassis) {
                    case "small":
                      return "h-8 w-8 sm:h-10 sm:w-10";
                    case "large":
                      return "h-12 w-12 sm:h-14 sm:w-14";
                    case "extra":
                      return "h-12 w-12 sm:h-14 sm:w-14";
                    case "medium":
                    default:
                      return "h-10 w-10 sm:h-12 sm:w-12";
                  }
                })();

                // Create scrollable single-row container with left/right controls
                const scrollRef = React.createRef<HTMLDivElement>();

                const scrollByAmount = (dir: "left" | "right") => {
                  const el = scrollRef.current;
                  if (!el) return;
                  const amount = el.clientWidth * 0.6; // scroll by a fraction of the visible width
                  el.scrollBy({
                    left: dir === "left" ? -amount : amount,
                    behavior: "smooth",
                  });
                };

                return (
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 z-20 w-[110%] sm:w-[120%] md:w-[130%] lg:w-[140%] flex items-center justify-center">
                    <button
                      type="button"
                      aria-label="Prev icons"
                      onClick={() => scrollByAmount("left")}
                      className="p-2 bg-white/80 rounded-full shadow-sm mr-2 text-[#003366]"
                    >
                      ‹
                    </button>

                    <div
                      ref={scrollRef}
                      className="flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap items-center py-1"
                      style={{ scrollBehavior: "smooth" }}
                    >
                      {(() => {
                        const normalize = (s: string) =>
                          (s || "")
                            .replace(/\uFFFD/g, "")
                            .replace(/\u2011/g, "-")
                            .replace(/\u00A0/g, " ")
                            .replace(/\s+/g, " ")
                            .trim()
                            .toLowerCase();

                        const lookup = (label: string) => {
                          if (!label) return undefined;
                          const nk = normalizeKey(label);

                          // 1) direct normalized stored map lookup
                          if (normalizedStoredMap[nk])
                            return normalizedStoredMap[nk];

                          // 2) try overlayIconMap by normalized key (prefer string URLs)
                          if (overlayIconMap) {
                            for (const k of Object.keys(overlayIconMap)) {
                              if (
                                normalizeKey(k) === nk &&
                                typeof overlayIconMap[k] === "string"
                              )
                                return overlayIconMap[k] as string;
                            }
                            for (const k of Object.keys(overlayIconMap)) {
                              if (normalizeKey(k) === nk)
                                return overlayIconMap[k];
                            }
                          }

                          // 3) try slight variant (no spaces) on normalizedStoredMap
                          const nkNoSpace = nk.replace(/\s/g, "");
                          if (normalizedStoredMap[nkNoSpace])
                            return normalizedStoredMap[nkNoSpace];

                          // 4) as last resort, try direct storedMap raw keys
                          if (storedMap[label]) return storedMap[label];

                          return undefined;
                        };

                        return overlayLabels.map((lab, i) => {
                          const srcOrNode = lookup(lab as string);
                          return (
                            <div
                              key={`${lab}-${i}`}
                              className={`${sizeClass} flex items-center justify-center inline-flex flex-shrink-0`}
                              style={{ display: "inline-flex" }}
                            >
                              {typeof srcOrNode === "string" && srcOrNode ? (
                                (() => {
                                  const src = srcOrNode as string;
                                  const srcSet = src.includes("width=")
                                    ? `${src} 1x, ${src.replace(/width=\d+/, "width=1600")} 2x`
                                    : undefined;
                                  return (
                                    <img
                                      src={src}
                                      srcSet={srcSet}
                                      alt={lab}
                                      className="h-full w-full object-contain"
                                      decoding="async"
                                      loading="eager"
                                    />
                                  );
                                })()
                              ) : srcOrNode ? (
                                <>{srcOrNode}</>
                              ) : (
                                <div className="text-xs inline-block">
                                  {lab}
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>

                    <button
                      type="button"
                      aria-label="Next icons"
                      onClick={() => scrollByAmount("right")}
                      className="p-2 bg-white/80 rounded-full shadow-sm ml-2 text-[#003366]"
                    >
                      ›
                    </button>
                  </div>
                );
              })()}

            <img
              ref={carRef}
              src={effectiveImageSrc}
              alt={
                typeof label === "string" ? `bus image - ${label}` : "bus image"
              }
              className="h-full w-auto object-contain mx-auto select-none"
              decoding="async"
              loading="eager"
              onLoad={() => {
                // update shadow once image dimensions are available
                setTimeout(() => {
                  try {
                    updateShadow();
                  } catch (e) {
                    /* ignore */
                  }
                }, 10);
              }}
            />

            {/* color overlay: covers the same area as the image. If a mask image is available, use mask-image to only color masked areas; otherwise apply a full-image tint as a fallback so uploaded vehicle types are colored too */}
            {effectiveColorHex && (
              (() => {
                // Determine chassis to optionally adjust blend mode for accuracy
                let selectedChassis: string | null = null;
                try {
                  selectedChassis =
                    (persistedFinal?.chassis as string) ||
                    sessionStorage.getItem("design.chassis");
                } catch {}
                const useNormalBlend = selectedChassis === "medium" || selectedChassis === "small" || selectedChassis === "large"; // ensure exact color for standard, small, and van buses
                const baseStyle: React.CSSProperties = {
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: effectiveColorHex,
                  pointerEvents: "none",
                  opacity: 1,
                };
                const blended: React.CSSProperties = useNormalBlend
                  ? baseStyle
                  : { ...baseStyle, mixBlendMode: "multiply" };
                return (
                  <div
                    aria-hidden="true"
                    style=
                      {effectiveColorMaskSrc
                        ? {
                            ...blended,
                            WebkitMaskImage: `url(${effectiveColorMaskSrc})`,
                            WebkitMaskSize: "contain",
                            WebkitMaskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                            maskImage: `url(${effectiveColorMaskSrc})`,
                            maskSize: "contain",
                            maskRepeat: "no-repeat",
                            maskPosition: "center",
                          }
                        : {
                            ...blended,
                            opacity: useNormalBlend ? 0.9 : 0.75,
                          }
                    }
                  />
                );
              })()
            )}

            {/** optional star overlay placed at top-right of the vehicle image container */}
            {/** starSrc is measured relative to this inner container (position: relative) */}
            {/** we style it to slightly overlap the image */}
            {starSrc && (
              <img
                src={starSrc}
                alt=""
                className="absolute pointer-events-none select-none"
                style={{ top: -8, right: -8, width: 28, height: 28 }}
                decoding="async"
                loading="eager"
                aria-hidden="true"
              />
            )}

            {/* Color overlay removed — VehiclePreview renders the base image only */}
          </div>
        </div>
      ) : (
        <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">
          {placeholderText}
        </div>
      )}

      {showSelectedText && label && (
        <div
          role="group"
          aria-label="vehicle-label"
          className="mt-1 font-sarabun font-medium text-[#001a73] text-center text-[13px] max-w-[260px] mx-auto truncate"
        >
          <span className="chassis-label-mobile">รถที่เลือก : </span>
          {label}
        </div>
      )}
    </div>
  );
};

export default VehiclePreview;
