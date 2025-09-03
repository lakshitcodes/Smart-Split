import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SmartSplit",
  description: "A smart way to split expenses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="logos/logo-s.png" sizes="any" />
      </head>
      <body
        className={`${inter.className}`}
      >
        <ClerkProvider>
          <ConvexClientProvider>


            <Header />
            <main className="min-h-screen">
              {children}
              <Toaster richColors />
            </main>
          </ConvexClientProvider>
        </ClerkProvider>
        <Footer />
      </body>
    </html>
  );
}
