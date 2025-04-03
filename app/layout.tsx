import { type ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import WormholeBackground from "@/components/WormholeBackground";

export const metadata: Metadata = {
  title: "Gaurang Ambasana | Portfolio",
  description: "Crafted with passion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased relative">
        <WormholeBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
