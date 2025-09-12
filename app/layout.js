"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import BottomNavbar from "@/components/navbar";
import { useState } from "react";
import SmartSplitSplash from "@/components/SmartSplitSplash";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {

  const [showSplash, setShowSplash] = useState(true);
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="logos/logo-s.png" sizes="any" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="/logos/logo-s.png" />

      </head>
      <body
        className={`${inter.className} min-h-[100dvh]`}
      >
        <ClerkProvider>
          <ConvexClientProvider>

            {showSplash && (
              <SmartSplitSplash
                logoSrc="/logos/logo-s.png"                 // optional: put your logo in public/
                appName="SmartSplit"
                accentShade="emerald"
                duration={3000}                     // ms
                onFinish={() => setShowSplash(false)}
              />
            )}
            <Header />
            <main className="min-h-screen">
              {children}
              <BottomNavbar />
              <Toaster richColors />
            </main>
          </ConvexClientProvider>
        </ClerkProvider>
        <Footer />
      </body>
    </html>
  );
}
