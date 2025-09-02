import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Ensure we have a root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Create or reuse root on the container to avoid duplicate createRoot during HMR
const existingRoot = (rootElement as any).__reactRoot as ReturnType<typeof createRoot> | undefined;
const root = existingRoot ?? createRoot(rootElement);
if (!existingRoot) {
  (rootElement as any).__reactRoot = root;
}

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
