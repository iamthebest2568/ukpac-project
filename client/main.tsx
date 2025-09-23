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

  // Normalize global errors to ensure Vite's overlay receives Error objects
  window.addEventListener("error", (ev) => {
    try {
      // some errors may be strings or missing stack/frame info — wrap them
      if (!ev.error || !(ev.error instanceof Error)) {
        const message = ev.message || "Uncaught error";
        const e = new Error(typeof ev.error === "string" ? ev.error : message);
        // attach original to help debugging
        (e as any).original = ev.error || null;
        // log and rethrow so Vite overlay can capture a proper Error
        // eslint-disable-next-line no-console
        console.error("Normalized window.onerror:", e, "original:", ev.error);
        throw e;
      }
    } catch (err) {
      // If normalizing causes an exception, log it but don't break the app
      // eslint-disable-next-line no-console
      console.error("Error normalizing window.onerror", err);
    }
  });

  window.addEventListener("unhandledrejection", (ev) => {
    try {
      const reason = (ev as any).reason;
      if (!reason || !(reason instanceof Error)) {
        const e = new Error(
          typeof reason === "string" ? reason : "Unhandled promise rejection",
        );
        (e as any).original = reason;
        // eslint-disable-next-line no-console
        console.error("Normalized unhandledrejection:", e, "original:", reason);
        // rethrow so overlay can pick it up
        throw e;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error normalizing unhandledrejection", err);
    }
  });
}
