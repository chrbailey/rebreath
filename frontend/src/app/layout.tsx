import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReBreath — AI Music Reimaginer",
  description:
    "Upload your own music and AI reimagines it — different genres, separated stems, mood-adapted versions, all rights-clear by design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`}>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
