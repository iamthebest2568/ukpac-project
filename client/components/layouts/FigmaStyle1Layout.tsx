import React from "react";

interface FigmaStyle1LayoutProps {
  /** Background image URL or video URL */
  backgroundImage: string;
  /** Alt text for background image */
  backgroundAlt?: string;
  /** Whether the background is a video */
  isVideo?: boolean;
  /** Whether video should autoplay (default: true) */
  autoPlay?: boolean;
  /** Title text to display */
  title: string;
  /** Array of button configurations */
  buttons: Array<{
    text: string;
    onClick: () => void;
    ariaLabel?: string;
  }>;
  /** Optional replay button configuration */
  replayButton?: {
    onClick: () => void;
    ariaLabel?: string;
  };
  /** Additional CSS classes for customization */
  className?: string;
  /** Video segment configuration for button clicks */
  videoSegment?: {
    startTime: number;
    endTime: number;
  };
  /** Callback when video segment playback completes */
  onVideoSegmentComplete?: () => void;
}

/**
 * FigmaStyle1Layout - Reusable layout component for figma-style1 design system
 *
 * Features:
 * - Mobile-first responsive design
 * - Full-screen background with gradient overlay
 * - Bottom-positioned content
 * - Consistent button interactions
 * - Optional enhanced replay button
 * - Accessibility support
 */
const FigmaStyle1Layout: React.FC<FigmaStyle1LayoutProps> = ({
  backgroundImage,
  backgroundAlt = "Background image",
  title,
  buttons,
  replayButton,
  className = "",
  isVideo,
  autoPlay = true,
  videoSegment,
  onVideoSegmentComplete,
}) => {
  const [videoFailed, setVideoFailed] = React.useState(false);
  const [isPlayingSegment, setIsPlayingSegment] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const isVideoUrl = React.useMemo(
    () => /\.(mp4|webm|ogg)(\?.*)?$/i.test(backgroundImage),
    [backgroundImage],
  );
  const shouldUseVideo = !videoFailed && (isVideo ?? isVideoUrl) === true;

  const mediaErrorMessage = (code?: number) => {
    switch (code) {
      case 1:
        return "MEDIA_ERR_ABORTED: fetching process aborted by user";
      case 2:
        return "MEDIA_ERR_NETWORK: error occurred when downloading";
      case 3:
        return "MEDIA_ERR_DECODE: error occurred when decoding";
      case 4:
        return "MEDIA_ERR_SRC_NOT_SUPPORTED: media source not supported";
      default:
        return "Unknown media error";
    }
  };

  const handleVideoError = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>,
  ) => {
    const video = e.currentTarget;
    const err = video.error;
    const details = {
      src: video.currentSrc || video.src,
      code: err?.code ?? null,
      message: mediaErrorMessage(err?.code ?? undefined),
      networkState: video.networkState,
      readyState: video.readyState,
    };
    console.error("Video error details:", details, err || "");
    setVideoFailed(true);
  };

  const handleLoadedData = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>,
  ) => {
    const v = e.currentTarget;
    setVideoFailed(false);
    console.log("Video data loaded:", {
      src: v.currentSrc || v.src,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight,
      readyState: v.readyState,
    });
  };

  // Reset error state when source changes
  React.useEffect(() => {
    setVideoFailed(false);
  }, [backgroundImage]);

  // Video segment playback functions
  const playVideoSegment = React.useCallback(() => {
    if (!videoRef.current || !videoSegment || isPlayingSegment) return;

    const video = videoRef.current;
    setIsPlayingSegment(true);

    // Handle special case where end time is before start time (scene cut)
    const isReversed = videoSegment.endTime < videoSegment.startTime;

    if (isReversed) {
      // For reversed segments (like intro-who-are-you: 0.7s to 0.15s)
      // Play from start to end time, then jump to start time and play to actual end
      video.currentTime = videoSegment.endTime;
      video.play();

      const handleTimeUpdate = () => {
        if (video.currentTime >= videoSegment.startTime) {
          video.pause();
          video.removeEventListener("timeupdate", handleTimeUpdate);
          setIsPlayingSegment(false);
          if (onVideoSegmentComplete) {
            onVideoSegmentComplete();
          }
        }
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
    } else {
      // Normal segment playback
      video.currentTime = videoSegment.startTime;
      video.play();

      const handleTimeUpdate = () => {
        if (video.currentTime >= videoSegment.endTime) {
          video.pause();
          video.removeEventListener("timeupdate", handleTimeUpdate);
          setIsPlayingSegment(false);
          if (onVideoSegmentComplete) {
            onVideoSegmentComplete();
          }
        }
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
    }
  }, [videoSegment, isPlayingSegment, onVideoSegmentComplete]);

  const restartVideo = React.useCallback(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    video.currentTime = 0;
    video.play();
    setIsPlayingSegment(false);
  }, []);

  // Enhanced button click handler
  const handleButtonClick = React.useCallback(
    (originalOnClick: () => void) => {
      return () => {
        if (videoSegment && videoRef.current) {
          playVideoSegment();
          // Call original onClick after a short delay to allow video to play
          setTimeout(
            originalOnClick,
            Math.abs(videoSegment.endTime - videoSegment.startTime) * 1000 +
              100,
          );
        } else {
          originalOnClick();
        }
      };
    },
    [playVideoSegment, videoSegment],
  );

  // Enhanced replay button handler
  const handleReplayClick = React.useCallback(() => {
    restartVideo();
    if (replayButton?.onClick) {
      replayButton.onClick();
    }
  }, [restartVideo, replayButton]);

  return (
    <div className={`figma-style1-container ${className}`}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          marginLeft: "20px",
          width: "100%",
          minHeight: "20px",
          minWidth: "20px",
        }}
      >
        <div
          style={{
            position: "relative",
          }}
        >
          <video
            autoPlay={true}
            muted={true}
            controls={false}
            playsInline={true}
            loop={true}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: "1",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              marginLeft: "20px",
              minHeight: "20px",
              minWidth: "20px",
            }}
          >
            <source
              type="video/mp4"
              src="https://cdn.builder.io/o/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fd27731a526464deba0016216f5f9e570%2Fcompressed?apiKey=YJIGb4i01jvw0SRdL5Bt&token=d27731a526464deba0016216f5f9e570&alt=media&optimized=true"
            />
          </video>
          <div
            style={{
              width: "100%",
              paddingTop: "70.04048582995948%",
              pointerEvents: "none",
              fontSize: "0",
            }}
          />
        </div>
      </div>
      <div className="figma-style1-content">
        {/* Background Image/Video with Overlay */}
        <div className="figma-style1-background">
          {shouldUseVideo ? (
            <video
              ref={videoRef}
              key={backgroundImage}
              src={backgroundImage}
              autoPlay={autoPlay}
              loop
              muted
              playsInline
              controls={false}
              preload="auto"
              crossOrigin="anonymous"
              className="figma-style1-background-image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
              onLoadStart={() => console.log("Video loading started")}
              onCanPlay={() => console.log("Video can play")}
              onError={handleVideoError}
              onStalled={() => console.warn("Video stalled")}
              onLoadedData={handleLoadedData}
            />
          ) : (
            <img
              src={backgroundImage}
              alt={backgroundAlt}
              className="figma-style1-background-image"
            />
          )}
          <div className="figma-style1-background-overlay" />
        </div>

        {/* Main Content */}
        <div className="figma-style1-main">
          {/* Replay Button (Optional) */}
          {replayButton && (
            <div className="figma-style1-header">
              <button
                onClick={handleReplayClick}
                className="figma-style1-replay-button"
                aria-label={replayButton.ariaLabel || "ดูอีกครั้ง"}
              >
                <div className="flex flex-col items-center">
                  {/* Yellow Circle with Replay Icon */}
                  <div className="w-[50px] h-[50px] bg-[#EFBA31] rounded-full flex items-center justify-center mb-2 shadow-lg">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  {/* Text */}
                  <span className="text-black font-kanit text-sm font-medium">
                    ดูอีกครั้ง
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Content Area */}
          <div
            className={`figma-style1-content-area ${!title ? "justify-center" : ""}`}
          >
            {/* Title */}
            {title && (
              <div className="figma-style1-title-container">
                <h1 className="figma-style1-title">{title}</h1>
              </div>
            )}

            {/* Buttons */}
            <div className="figma-style1-button-container">
              {buttons.map((button, index) => (
                <React.Fragment key={index}>
                  <button
                    onClick={handleButtonClick(button.onClick)}
                    className="figma-style1-button"
                    aria-describedby={`button-description-${index}`}
                  >
                    <span className="figma-style1-button-text">
                      {button.text}
                    </span>
                  </button>
                  {button.ariaLabel && (
                    <div
                      id={`button-description-${index}`}
                      className="figma-style1-sr-only"
                    >
                      {button.ariaLabel}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FigmaStyle1Layout;
