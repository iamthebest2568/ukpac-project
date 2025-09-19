import React from "react";

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
}

const VehiclePreview: React.FC<Props> = ({
  imageSrc,
  label,
  overlayLabels = [],
  overlayIconMap = {},
  placeholderText = "ภาพสำหรับรุ่นนี้จะถูกเพิ��มภายหลัง",
  colorFilter = null,
  colorHex = null,
}) => {
  return (
    <div className="w-full rounded-md flex flex-col items-center justify-center gap-2">
      {imageSrc ? (
        <div
          className="relative w-full flex items-center justify-center"
          style={{ minHeight: "100px" }}
        >
          <img
            src={SHADOW_URL}
            alt="เงา"
            className="absolute w-[60%] max-w-[320px] pointer-events-none select-none"
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
              src={imageSrc}
              alt={typeof label === "string" ? `ภาพรถ - ${label}` : "ภาพรถ"}
              className="h-full w-auto object-contain mx-auto select-none"
              decoding="async"
              loading="eager"
              style={!colorHex && colorFilter ? { filter: colorFilter } : undefined}
            />

            {colorHex && (
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: colorHex,
                  mixBlendMode: "multiply",
                  opacity: 0.85,
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

      <div
        role="group"
        aria-label="vehicle-label"
        className="mt-2 font-prompt font-semibold text-[#001a73] text-center text-sm md:text-base max-w-[320px] mx-auto"
      >
        {label}
      </div>
    </div>
  );
};

export default VehiclePreview;
