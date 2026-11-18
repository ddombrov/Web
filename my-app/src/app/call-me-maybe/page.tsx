"use client";

const APP_URL = "https://ai-voice-caller.pages.dev";

export default function CallMeMaybePage() {
  return (
    <iframe
      src={APP_URL}
      title="AI Voice Caller"
      allow="autoplay; fullscreen"
      style={{ position: "fixed", top: 64, left: 0, width: "100%", height: "calc(100% - 64px)", border: 0, display: "block" }}
    />
  );
}
