import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentBridge Pro 3.2 - Meridian Solutions HR Portal",
  description:
    "Can you spot the aliens hiding in the résumé pile? A Windows 95-style HR simulator where not every applicant is human.",
  metadataBase: new URL("https://meridian-corp.net"),
  openGraph: {
    title: "Meridian Corp — Alien HR Simulator",
    description:
      "Review résumés. Hire humans. Flag aliens. A retro Windows 95 HR game.",
    url: "https://meridian-corp.net",
    siteName: "Meridian Corp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meridian Corp — Alien HR Simulator",
    description:
      "Review résumés. Hire humans. Flag aliens. A retro Windows 95 HR game.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
