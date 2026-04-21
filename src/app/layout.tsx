import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AerisClaim — The Operating System for Freight Claims Recovery",
  description:
    "AerisClaim centralizes the full freight claims lifecycle—intake, investigation, documentation, submission, and settlement—into one managed operating system. Recover what your current process is missing.",
  keywords: [
    "freight claims",
    "claims recovery",
    "LTL claims",
    "freight damage claims",
    "claims management software",
    "freight recovery",
  ],
  openGraph: {
    title: "AerisClaim — Freight Claims Recovery OS",
    description:
      "Stop missing freight claim revenue. AerisClaim runs the full recovery process, from document intake to final settlement.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#09090B] text-zinc-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#C01028] focus:text-white focus:text-[13px] focus:font-semibold focus:rounded-sm"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
