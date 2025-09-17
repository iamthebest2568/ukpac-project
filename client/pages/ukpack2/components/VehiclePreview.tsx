import React from 'react';

const SHADOW_URL = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb1e30b1544304677996b179fc27ae5c7?format=webp&width=800';

interface Props {
  imageSrc?: string | null;
  label?: string | React.ReactNode;
  overlayLabels?: string[];
  overlayIconMap?: Record<string, string>;
  placeholderText?: string;
}

const VehiclePreview: React.FC<Props> = ({
  imageSrc,
  label,
  overlayLabels = [],
  overlayIconMap = {},
  placeholderText = 'ภาพสำหรับรุ่นนี้จะถูกเพิ่มภายหลัง',
}) => {
  return (
    <div className="w-full rounded-md flex flex-col items-center justify-center gap-2">
      {imageSrc ? (
        <div className="relative w-full flex items-center justify-center" style={{ minHeight: '100px' }}>
          <img
            src={SHADOW_URL}
            alt="เงา"
            className="absolute w-[60%] max-w-[320px] pointer-events-none select-none"
            style={{ bottom: '8px' }}
            decoding="async"
            loading="eager"
            aria-hidden="true"
          />

          <div className="relative w-[60%] max-w-[320px]" style={{ height: '120px' }}>
            {overlayLabels && overlayLabels.length > 0 && (
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 flex flex-wrap justify-center gap-2 z-20 max-w-[80%]">
                {overlayLabels.map((lab, i) => {
                  const src = overlayIconMap[lab];
                  return (
                    <div
                      key={`${lab}-${i}`}
                      className="bg-white/90 rounded-full p-1 h-8 w-8 flex items-center justify-center"
                    >
                      {src ? (
                        <img src={src} alt={lab} className="h-5 w-5 object-contain" />
                      ) : (
                        <div className="text-xs">{lab}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <img
              src={imageSrc}
              alt={typeof label === 'string' ? `ภาพรถ - ${label}` : 'ภาพรถ'}
              className="h-full w-auto object-contain mx-auto select-none"
              decoding="async"
              loading="eager"
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">
          {placeholderText}
        </div>
      )}

      <p className="mt-2 font-prompt font-semibold text-[#001a73] text-center text-sm md:text-base max-w-[320px] mx-auto">
        {label}
      </p>
    </div>
  );
};

export default VehiclePreview;
