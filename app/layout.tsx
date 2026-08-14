import type { Metadata, Viewport } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import { WhatsAppInvite } from "@/components/WhatsAppInvite";
import "@/app/globals.css";

const serif = EB_Garamond({ subsets: ["latin"], variable: "--serif-font", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--sans-font", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "CEL — The Six-Piece Hunt",
  description: "Find six CEL posters around BITS Goa, scan each QR, and complete the startup puzzle.",
  openGraph: {
    title: "CEL — The Six-Piece Hunt",
    description: "Find six CEL posters around BITS Goa, scan each QR, and complete the startup puzzle.",
    images: ["/api/logo"]
  }
};

export const viewport: Viewport = {
  themeColor: "#F2EFE6",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${serif.variable} ${sans.variable}`}>
        <div className="paper-noise" aria-hidden="true" />
        {children}
        <WhatsAppInvite />
      </body>
    </html>
  );
}
