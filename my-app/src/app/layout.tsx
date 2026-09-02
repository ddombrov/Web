import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry";
import Nav from "./components/Nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Daniel Dombrovsky",
  description: "Daniel Dombrovsky's portfolio website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning>
        <ThemeRegistry>
          <Nav />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
