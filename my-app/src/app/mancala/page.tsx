"use client";

const GAME_URL = "/mancala-game/play.html";

export default function MancalaPage() {
  return (
    <iframe
      src={GAME_URL}
      title="Mancala"
      allow="fullscreen"
      style={{ position: "fixed", top: 64, left: 0, width: "100%", height: "calc(100% - 64px)", border: 0, display: "block" }}
    />
  );
}
