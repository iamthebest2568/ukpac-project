import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Ensure we have a root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Create root only once
const root = createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
