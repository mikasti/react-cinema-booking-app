import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

async function enableMSWMocking() {
  if (process.env.REACT_APP_USE_MOCK !== "true") {
    return;
  }
  const { worker } = await import("./__mocks__/browser");

  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

enableMSWMocking().then(() => {
  const container = document.getElementById("root");
  if (!container) throw new Error("Root element not found");
  const root = createRoot(container);
  root.render(<App />);
});
