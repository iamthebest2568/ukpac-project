import React, { useEffect, useRef } from "react";

const SHADOW_URL =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb1e30b1544304677996b179fc27ae5c7?format=webp&width=800";

interface Props {
  imageSrc?: string | null;
  label?: string | React.ReactNode;
  overlayLabels?: string[];
  overlayIconMap?: Record<string, string | React.ReactNode>;
  placeholderText?: string;
  // color overlay props removed — color matching disabled
  // optional className to allow page-scoped padding/alignment
  className?: string;
  // when true, VehiclePreview will render a "รถที่เลือก : {label}" line beneath the preview
  showSelectedText?: boolean;
  // optional star icon to overlay on the top-right of the vehicle image
  starSrc?: string | null;
}

const VehiclePreview: React.FC<Props> = ({
  imageSrc,
  label,
  overlayLabels = [],
  overlayIconMap = {},
  placeholderText = "ภาพสำหรับรุ่นนี้จะถูกเพิ่มภายหลัง",
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

  useEffect(() => {
    // update when imageSrc changes and on resize
    updateShadow();
    const onResize = () => updateShadow();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc]);

  return (
    <div className={`w-full rounded-md flex flex-col items-center justify-center gap-2 ${className || ""}`}>
      {imageSrc ? (
        <div
          className="relative w-full flex items-center justify-center"
          style={{ minHeight: "100px" }}
          ref={containerRef}
        >
          {showShadow && (
          <img
            ref={shadowRef}
            src={SHADOW_URL}
            alt="shadow"
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
            {overlayLabels && overlayLabels.length > 0 && (() => {
              // Allow stored overlay icon mappings (set by selection pages) to override
              // the overlayIconMap prop. Stored mapping is expected at
              // sessionStorage.design.overlayIconMap as { [label]: string }
              let storedMap: Record<string, string> = {};
              try {
                const raw = sessionStorage.getItem("design.overlayIconMap");
                if (raw) storedMap = JSON.parse(raw) as Record<string, string>;
              } catch {}

              // choose size classes based on selected chassis (stored in sessionStorage.design.chassis)
              const chassis = (() => {
                try { return sessionStorage.getItem("design.chassis") || undefined; } catch { return undefined; }
              })();
              const sizeClass = (() => {
                switch (chassis) {
                  case "small": return "h-8 w-8 sm:h-10 sm:w-10";
                  case "large": return "h-12 w-12 sm:h-14 sm:w-14";
                  case "extra": return "h-12 w-12 sm:h-14 sm:w-14";
                  case "medium":
                  default:
                    return "h-10 w-10 sm:h-12 sm:w-12";
                }
              })();

              return (
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 flex flex-wrap justify-center items-center gap-2 z-20 w-[110%] sm:w-[120%] md:w-[130%] lg:w-[140%]">
                  {overlayLabels.map((lab, i) => {
                    const propVal = overlayIconMap ? overlayIconMap[lab] : undefined;
                    const storedVal = storedMap ? storedMap[lab] : undefined;
                    const srcOrNode = storedVal || propVal;
                    return (
                      <div
                      key={`${lab}-${i}`}
                      className={`${sizeClass} flex items-center justify-center inline-flex flex-shrink-0`} // size depends on chassis
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
                          <div className="text-xs inline-block">{lab}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <img
              ref={carRef}
              src={imageSrc}
              alt={typeof label === "string" ? `bus image - ${label}` : "bus image"}
              className="h-full w-auto object-contain mx-auto select-none"
              decoding="async"
              loading="eager"
              onLoad={() => {
                // update shadow once image dimensions are available
                setTimeout(() => {
                  try { updateShadow(); } catch (e) { /* ignore */ }
                }, 10);
              }}
            />

            {/** optional star overlay placed at top-right of the vehicle image container */}
            {/** starSrc is measured relative to this inner container (position: relative) */}
            {/** we style it to slightly overlap the image */}
            {starSrc && (
              <img
                src={starSrc}
                alt="star"
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
          className="mt-1 font-sarabun font-semibold text-[#001a73] text-center text-[17.6px] max-w-[320px] mx-auto"
        >
          <span className="chassis-label-mobile">รถที่เลือก : </span>
          {label}
        </div>
      )}

    </div>
  );
};

export default VehiclePreview;
