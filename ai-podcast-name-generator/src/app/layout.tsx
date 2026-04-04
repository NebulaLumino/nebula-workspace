import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Podcast Name Generator",
  description: "Generate catchy, memorable podcast names with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
