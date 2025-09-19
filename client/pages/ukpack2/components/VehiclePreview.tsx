import React, { useEffect, useRef } from "react";

const SHADOW_URL =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb1e30b1544304677996b179fc27ae5c7?format=webp&width=800";

interface Props {
  imageSrc?: string | null;
  label?: string | React.ReactNode;
  overlayLabels?: string[];
  overlayIconMap?: Record<string, string | React.ReactNode>;
  placeholderText?: string;
  colorFilter?: string | null;
  // new: direct hex color overlay (eg. "#7d53a2"). If provided, takes precedence over colorFilter.
  colorHex?: string | null;
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
  colorFilter = null,
  colorHex = null,
  className,
  showSelectedText = false,
}) => {
  const shadowRef = useRef<HTMLImageElement | null>(null);
  const carRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateShadow = () => {
    const carEl = carRef.current;
    const shadowEl = shadowRef.current;
    const containerEl = containerRef.current;
    if (!carEl || !shadowEl || !containerEl) return;
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
          <img
            ref={shadowRef}
            src={SHADOW_URL}
            alt="เงา"
            className="absolute pointer-events-none select-none"
            style={{ bottom: "8px" }}
            decoding="async"
            loading="eager"
            aria-hidden="true"
          />

          <div
            className="relative w-[60%] sm:w-[65%] md:w-[70%] lg:w-[75%] max-w-[320px] sm:max-w-[380px] md:max-w-[480px]"
            style={{ height: "120px" }}
          >
            {overlayLabels && overlayLabels.length > 0 && (
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 flex flex-wrap justify-center items-center gap-2 z-20 w-[95%] sm:w-[90%] md:w-[100%]">
                {overlayLabels.map((lab, i) => {
                  const srcOrNode = overlayIconMap[lab];
                  return (
                    <div
                      key={`${lab}-${i}`}
                      className="bg-white/90 rounded-full p-1 h-8 w-8 flex items-center justify-center inline-flex flex-shrink-0"
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
                              className="h-6 w-6 object-contain"
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
            )}

            <img
              ref={carRef}
              src={imageSrc}
              alt={typeof label === "string" ? `ภาพรถ - ${label}` : "ภาพรถ"}
              className="h-full w-auto object-contain mx-auto select-none"
              decoding="async"
              loading="eager"
              onLoad={() => {
                // update shadow once image dimensions are available
                setTimeout(() => {
                  try { updateShadow(); } catch (e) { /* ignore */ }
                }, 10);
              }}
              style={
                !colorHex && colorFilter ? { filter: colorFilter } : undefined
              }
            />

            {colorHex && imageSrc && (
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: colorHex,
                  zIndex: 10,
                  WebkitMaskImage: `url(${imageSrc})`,
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "contain",
                  WebkitMaskPosition: "center",
                  maskImage: `url(${imageSrc})`,
                  maskRepeat: "no-repeat",
                  maskSize: "contain",
                  maskPosition: "center",
                }}
              />
            )}
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
          className="mt-1 font-prompt font-semibold text-[#001a73] text-center text-sm md:text-base max-w-[320px] mx-auto"
        >
          <span className="chassis-label-mobile">รถที่เลือก : </span>
          {label}
        </div>
      )}

    </div>
  );
};

export default VehiclePreview;
