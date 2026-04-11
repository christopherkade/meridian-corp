import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentBridge Pro 3.2 - Meridian Solutions HR Portal",
  description: "Meridian Solutions™ HR Resume Processing System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
