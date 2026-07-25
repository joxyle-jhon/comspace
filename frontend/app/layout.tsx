import type { Metadata } from "next";
import { Inter, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "COMSPACE | Find Your Comfortable Space",
  description: "Discover curated stays and work-friendly spaces designed for remote professionals, digital nomads, and traveling creators.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans flex flex-col">
        <SmoothScrollProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#0F172A",
                color: "#FFFFFF",
                borderRadius: "1rem",
                padding: "12px 16px",
                fontSize: "13px",
                fontWeight: "600",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              },
              success: {
                iconTheme: {
                  primary: "#FF5A1F",
                  secondary: "#FFFFFF",
                },
              },
            }}
          />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
