"use client";

import EmbeddedApp from "../components/EmbeddedApp";

const GAME_URL = "https://splendor-duel.danieldombrovsky9.workers.dev";

export default function SplendorDuelPage() {
  return <EmbeddedApp src={GAME_URL} title="Splendor Duel" allow="fullscreen; clipboard-write" />;
}
