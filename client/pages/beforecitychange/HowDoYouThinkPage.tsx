import { useState, useEffect } from "react";
import { useSession } from "../../hooks/useSession";
import { logEvent } from "../../services/dataLogger.js";
import FigmaStyle1Layout from "../../components/layouts/FigmaStyle1Layout.ukpack1";

import DesktopMockup from "./components/DesktopMockup";
import Uk1Button from "../../components/shared/Uk1Button";

const HowDoYouThinkPage = () => {
  const { sessionID, navigateToPage } = useSession();
  const [selectedOption, setSelectedOption] = useState<string>("");

  useEffect(() => {
    // Preload next potential pages
    import("./Ask05Page").catch(() => {});
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);

    // Log the selection
    logEvent({
      event: "HOW_DO_YOU_THINK_SELECTION",
      payload: {
        selectedOption: option,
        sessionID,
      },
    });

    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "OPINION_SELECT",
        payload: { selectedOption: option },
      };
      navigator.sendBeacon?.(
        "/api/track",
        new Blob([JSON.stringify(body)], { type: "application/json" }),
      ) ||
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
    } catch {}

    // Navigate to next page after a short delay based on selection
    setTimeout(() => {
      if (option === "agree") {
        // If user agrees, go to fake news flow
        navigateToPage("fakeNews", {
          from: "how_do_you_think",
          selectedOption: option,
          sessionID,
        });
      } else {
        // For neutral or disagree, go to Ask02 (next survey question)
        navigateToPage("ask02", {
          from: "how_do_you_think",
          selectedOption: option,
          sessionID,
        });
      }
    }, 300);
  };

  return (
    <DesktopMockup>
      <FigmaStyle1Layout
        backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb5edf32ee2ed476284e73427d3abce51?format=webp&width=800"
        className="how-do-you-think-page"
      >
        {/* Content Section positioned at bottom */}
        <div
          className="flex-1 flex flex-col items-center justify-end px-4 py-8 pb-12 relative z-10"
          style={{ background: "transparent", minHeight: "auto" }}
        >
          {/* Bottom-aligned content box */}
          <div
            className="w-full max-w-4xl px-4"
            style={{ paddingBottom: "env(safe-area-inset-bottom,24px)" }}
          >
            <div className="text-center mb-4">
              <h1
                className="font-prompt text-black text-center leading-tight"
                style={{
                  fontSize: "clamp(22px, 4.8vw, 52px)",
                  fontWeight: 600,
                  lineHeight: "1.05",
                }}
              >
                จากนโยบายที่คุณฟังเมื่อสักครู่
                <br />
                คุณมีความคิดเห็นอย่างไร
              </h1>
            </div>

            {/* Options stacked and balanced */}
            <div className="flex flex-col items-center gap-4 w-full">
              {[
                { key: "agree", text: "เห็นด้วย" },
                { key: "neutral", text: "เฉย ๆ" },
                { key: "disagree", text: "ไม่เห็นด้วย" },
              ].map((option) => (
                <Uk1Button
                  key={option.key}
                  onClick={() => handleOptionSelect(option.key)}
                  className="w-full max-w-[845px] transition-all duration-150"
                  style={{
                    height: "clamp(56px, 9vw, 96px)",
                    borderRadius: "999px",
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  }}
                  aria-label={`เลือก: ${option.text}`}
                >
                  <span
                    className="font-prompt text-black text-center"
                    style={{
                      fontSize: "clamp(18px, 3.8vw, 34px)",
                      fontWeight: 500,
                      letterSpacing: "0.4px",
                      lineHeight: "1",
                    }}
                  >
                    {option.text}
                  </span>
                </Uk1Button>
              ))}
            </div>
          </div>
        </div>
      </FigmaStyle1Layout>
    </DesktopMockup>
  );
};

export default HowDoYouThinkPage;
