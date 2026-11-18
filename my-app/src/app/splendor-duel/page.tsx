"use client";

const GAME_URL = "https://splendor-duel.danieldombrovsky9.workers.dev";

export default function SplendorDuelPage() {
  return (
    <iframe
      src={GAME_URL}
      title="Splendor Duel"
      allow="fullscreen; clipboard-write"
      style={{ position: "fixed", top: 64, left: 0, width: "100%", height: "calc(100% - 64px)", border: 0, display: "block" }}
    />
  );
}
