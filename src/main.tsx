import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./index.css";

const updateCheckIntervalMs = 5 * 60 * 1000;

const updateServiceWorker = registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (!registration) return;
    window.setInterval(async () => {
      if (!navigator.onLine) return;
      const response = await fetch(swUrl, {
        cache: "no-store",
        headers: {
          cache: "no-store",
          "cache-control": "no-cache"
        }
      });
      if (response?.status === 200) {
        await registration.update();
      }
    }, updateCheckIntervalMs);
  },
  onNeedRefresh() {
    window.dispatchEvent(new Event("anki-aero:update-ready"));
  }
});

function Root() {
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    const showUpdatePrompt = () => setUpdateReady(true);
    window.addEventListener("anki-aero:update-ready", showUpdatePrompt);
    return () => window.removeEventListener("anki-aero:update-ready", showUpdatePrompt);
  }, []);

  return (
    <App
      updateReady={updateReady}
      onDismissUpdate={() => setUpdateReady(false)}
      onConfirmUpdate={() => updateServiceWorker(true)}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
