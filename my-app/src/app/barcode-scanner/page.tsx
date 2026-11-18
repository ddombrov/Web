"use client";

const APP_URL = "https://oh-scanada.danieldombrovsky9.workers.dev";

export default function BarcodeScannerPage() {
  return (
    <iframe
      src={APP_URL}
      title="Canadian-Origin Barcode Scanner"
      allow="camera; fullscreen"
      style={{ position: "fixed", top: 64, left: 0, width: "100%", height: "calc(100% - 64px)", border: 0, display: "block" }}
    />
  );
}
