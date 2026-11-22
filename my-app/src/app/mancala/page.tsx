"use client";

import EmbeddedApp from "../components/EmbeddedApp";

const GAME_URL = "https://mancala.danieldombrovsky9.workers.dev";

export default function MancalaPage() {
  return <EmbeddedApp src={GAME_URL} title="Mancala" allow="fullscreen; clipboard-write" />;
}
