"use client";

import EmbeddedApp from "../components/EmbeddedApp";

const APP_URL = "https://ai-voice-caller.pages.dev";

export default function CallMeMaybePage() {
  return <EmbeddedApp src={APP_URL} title="AI Voice Caller" allow="autoplay; fullscreen" />;
}
