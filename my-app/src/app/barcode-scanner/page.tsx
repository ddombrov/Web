"use client";

import EmbeddedApp from "../components/EmbeddedApp";

const APP_URL = "https://oh-scanada.danieldombrovsky9.workers.dev";

export default function BarcodeScannerPage() {
  return <EmbeddedApp src={APP_URL} title="Canadian-Origin Barcode Scanner" allow="camera; fullscreen" />;
}
