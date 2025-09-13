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
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#16A34A", // Tailwind green-600
              colorText: "#111827", // Tailwind gray-900
              colorBackground: "#fff",
              borderRadius: "0.75rem", // rounded-xl
              fontFamily: inter.style.fontFamily,
            },
            elements: {
              card: "shadow-xl border border-gray-200",
              headerTitle: "text-green-600 text-2xl font-extrabold",
              socialButtonsBlockButton: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200",
              formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white font-semibold",
              footerAction: "text-green-600 hover:underline",
            },
          }}
          fallbackRedirectUrl="/dashboard"
        >
          <ConvexClientProvider>

            {showSplash && (
              <SmartSplitSplash
                logoSrc="/logos/logo-s.png"                 // optional: put your logo in public/
                appName="SmartSplit"
                accentShade="emerald"
                duration={1300}                     // ms
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
