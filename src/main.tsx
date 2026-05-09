import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./index.css";

const updateServiceWorker = registerSW({
  immediate: true,
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
