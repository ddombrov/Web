import type { Metadata } from "next";

// The tab shows the project's own name and icon while it is open on the website.
export const metadata: Metadata = {
  title: "Canadian-Origin Barcode Scanner · Daniel Dombrovsky",
  icons: { icon: "/projects/icons/barcode-scanner.png" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
