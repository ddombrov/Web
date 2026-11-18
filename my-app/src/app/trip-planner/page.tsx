"use client";

const APP_URL = "https://ai-vacation-planner.pages.dev";

export default function TripPlannerPage() {
  return (
    <iframe
      src={APP_URL}
      title="AI Vacation Planner"
      allow="fullscreen; geolocation"
      style={{ position: "fixed", top: 64, left: 0, width: "100%", height: "calc(100% - 64px)", border: 0, display: "block" }}
    />
  );
}
