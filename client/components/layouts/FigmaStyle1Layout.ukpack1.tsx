import { memo, Fragment, useEffect, useState } from "react";
import Uk1Button from "../shared/Uk1Button";
import "../../styles/figma-style1-ukpack1.css";

interface FigmaStyle1LayoutProps {
  backgroundImage: string;
  backgroundAlt?: string;
  title?: React.ReactNode;
  buttons?: Array<{
    text: string;
    onClick: () => void;
    ariaLabel?: string;
  }>;
  replayButton?: {
    onClick: () => void;
    ariaLabel?: string;
  };
  className?: string;
  imageLoading?: "eager" | "lazy";
  useBlueOverlay?: boolean;
  children?: React.ReactNode;
}

const FigmaStyle1Layout = ({
  backgroundImage,
  backgroundAlt = "Background image",
  title,
  buttons,
  replayButton,
  className = "",
  imageLoading = "lazy",
  useBlueOverlay = false,
  children,
}: FigmaStyle1LayoutProps) => {
  const isSourceSelection = className?.includes("source-selection-page");
  const [platformClass, setPlatformClass] = useState("");
  const [pageScope, setPageScope] = useState("");

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent || "";
    const isAndroid = /Android/i.test(ua);
    const isIPad =
      /iPad/.test(ua) ||
      (navigator.platform === "MacIntel" && typeof (window as any).ontouchend === "object");
    const isIPhone = /iPhone/.test(ua);
    if (isAndroid) setPlatformClass("is-android");
    else if (isIPhone || isIPad) setPlatformClass("is-ios");

    try {
      if (
        typeof window !== "undefined" &&
        window.location &&
        window.location.pathname.startsWith("/ukpack1")
      ) {
        if (!window.location.pathname.includes("uk-stornaway")) {
          setPageScope("figma-style1-ukpack1");
          document.body.classList.add("page-ukpack1");
          document.body.classList.remove("page-ukpack2");
        }
      } else if (
        typeof window !== "undefined" &&
        window.location &&
        window.location.pathname.startsWith("/ukpack2")
      ) {
        setPageScope("figma-style1-ukpack2");
        document.body.classList.add("page-ukpack2");
        document.body.classList.remove("page-ukpack1");
      } else {
        document.body.classList.remove("page-ukpack1");
        document.body.classList.remove("page-ukpack2");
      }
    } catch (e) {
      // noop
    }
  }, []);

  return (
    <div
      className={`figma-style1-container ${className} ${platformClass} ${pageScope} ${(() => {
        try {
          const p = typeof window !== "undefined" ? window.location.pathname || "" : "";
          return pageScope && !p.startsWith("/ukpack1/minigame-mn2") ? "fake-news-page" : "";
        } catch {
          return pageScope ? "fake-news-page" : "";
        }
      })()}`}
    >
      <div className="figma-style1-content">
        <div className="figma-style1-background" style={{ backgroundImage: "none" }}>
          {backgroundImage
            ? (() => {
                const setWidth = (url: string, w: number) => {
                  try {
                    const u = new URL(url);
                    u.searchParams.set("width", String(w));
                    return u.toString();
                  } catch (e) {
                    return url + (url.includes("?") ? "&" : "?") + `width=${w}`;
                  }
                };

                const src480 = setWidth(backgroundImage, 480);
                const src720 = setWidth(backgroundImage, 720);
                const src1080 = setWidth(backgroundImage, 1080);
                const src2160 = setWidth(backgroundImage, 2160);

                return (
                  <img
                    src={src720}
                    srcSet={`${src480} 480w, ${src720} 720w, ${src1080} 1080w, ${src2160} 2160w`}
                    sizes="(max-width: 480px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    alt={backgroundAlt}
                    className="figma-style1-background-image"
                    loading={imageLoading}
                    decoding="async"
                    style={{
                      objectFit: "cover",
                      objectPosition: pageScope.includes("figma-style1-ukpack1") ? "center 8%" : "center center",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                );
              })()
            : null}

          {useBlueOverlay ? (
            <div className={`figma-style1-background-overlay figma-style1-background-overlay--blue`} />
          ) : null}
        </div>

        <div className="figma-style1-main">
          {replayButton && !pageScope.includes("figma-style1-ukpack1") && (
            <div className="figma-style1-header">
              <button
                onClick={replayButton.onClick}
                className="figma-style1-replay-button"
                aria-label={replayButton.ariaLabel || "ดูอี��ครั้ง"}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-[50px] h-[50px] rounded-full flex items-center justify-center mb-2 shadow-lg"
                    style={{ backgroundColor: "#FFE000" }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="black" />
                    </svg>
                  </div>
                  <span className="text-black font-prompt text-sm font-medium">ดูอีกครั้ง</span>
                </div>
              </button>
            </div>
          )}

          <div className={`figma-style1-content-area ${!title ? "justify-center" : ""}`}>
            {title && (
              <div className="figma-style1-title-container" style={{ marginTop: isSourceSelection ? "32px" : undefined }}>
                <h1 className={`figma-style1-title ${isSourceSelection ? "figma-style1-title--black" : ""}`} style={isSourceSelection ? { fontSize: "36px", lineHeight: 1.05 } : undefined}>
                  {typeof title === "string" ? <p style={{ margin: 0 }}>{title}</p> : title}
                </h1>
              </div>
            )}

            {children ? (
              <>{children}</>
            ) : (
              <>
                <div className="figma-style1-button-container">
                  {buttons?.map((button, index) => (
    <Fragment key={index}>
      <Uk1Button onClick={button.onClick} aria-describedby={button.ariaLabel ? `button-description-${index}` : undefined}>
        {typeof button.text === "string" && button.text.trim() === "อื่นๆ" ? <p style={{ margin: 0 }}>อื่น ๆ</p> : button.text}
      </Uk1Button>
      {button.ariaLabel && (
        <div id={`button-description-${index}`} className="figma-style1-sr-only">
          {button.ariaLabel}
        </div>
      )}
    </Fragment>
  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FigmaStyle1Layout);
