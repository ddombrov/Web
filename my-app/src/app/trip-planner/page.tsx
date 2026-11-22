"use client";

import EmbeddedApp from "../components/EmbeddedApp";

const APP_URL = "https://ai-vacation-planner.pages.dev";

export default function TripPlannerPage() {
  return <EmbeddedApp src={APP_URL} title="AI Vacation Planner" allow="fullscreen; geolocation" />;
}
