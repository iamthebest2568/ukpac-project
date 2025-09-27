import React from "react";
import DesktopMockup from "./components/DesktopMockup";
import Page from "../MiniGameMN01Page";

const Wrapped = (props: any) => {
  // If the route is requested with ?embedded=1 we should render the page
  // directly (this is what the iframe will load). Otherwise render an
  // iframe inside the DesktopMockup so the app runs inside an iframe.
  let embedded = false;
  try {
    const sp = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : "",
    );
    embedded = sp.get("embedded") === "1" || sp.get("embedded") === "true";
  } catch (e) {
    embedded = false;
  }

  if (embedded) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <style>{`
          /* Embedded override: make layout fill iframe */
          html, body, #root { height: 100% !important; }
          .figma-style1-container { min-height: 100vh !important; width: 100% !important; }
          .figma-style1-content { max-width: 100% !important; width: 100% !important; height: 100vh !important; overflow: auto !important; }
          .figma-style1-background { position: absolute !important; }
        `}</style>
        <Page {...props} />
      </div>
    );
  }

  const src =
    typeof window !== "undefined"
      ? window.location.pathname + "?embedded=1"
      : "/ukpack1/minigame-mn1?embedded=1";

  return (
    <DesktopMockup>
      <iframe
        title="minigame-mn1-embed"
        src={src}
        style={{
          width: "100%",
          height: "100%",
          border: "0",
          background: "transparent",
        }}
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
      />
    </DesktopMockup>
  );
};

export default Wrapped;
