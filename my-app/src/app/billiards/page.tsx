"use client";

import EmbeddedApp from "../components/EmbeddedApp";

const GAME_URL = "https://billiards.danieldombrovsky9.workers.dev";

export default function BilliardsPage() {
  return <EmbeddedApp src={GAME_URL} title="8-Ball" allow="fullscreen" />;
}
