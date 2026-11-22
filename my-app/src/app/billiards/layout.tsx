import type { Metadata } from "next";

// The tab shows the project's own name and icon while it is open on the website.
export const metadata: Metadata = {
  title: "8-Ball · Daniel Dombrovsky",
  icons: { icon: "/projects/icons/billiards.png" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
