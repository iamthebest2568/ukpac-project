import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Ensure we have a root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Create or reuse root on the container to avoid duplicate createRoot during HMR
const existingRoot = (rootElement as any).__reactRoot as
  | ReturnType<typeof createRoot>
  | undefined;
const root = existingRoot ?? createRoot(rootElement);
if (!existingRoot) {
  (rootElement as any).__reactRoot = root;
}

// Render the app
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Dev-only scanner for U+FFFD occurrences
import { initNetworkThrottle } from './dev/networkThrottle';

// Initialize dev network throttling when in DEV
if ((import.meta as any).env && (import.meta as any).env.DEV) {
  try {
    initNetworkThrottle({ latency: 800, jitter: 300, enableByDefault: false });
  } catch (e) {
    // ignore
  }
}

if (import.meta.env && (import.meta as any).env.DEV) {
  setTimeout(() => {
    const nodes = Array.from(document.querySelectorAll("*"));
    for (const el of nodes) {
      if (/\uFFFD/.test(el.textContent || "")) {
        // eslint-disable-next-line no-console
        console.warn("U+FFFD found in:", el);
      }
    }
  }, 0);
}
