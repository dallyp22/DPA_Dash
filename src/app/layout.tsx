import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DPA Command Center",
  description: "Real-time business intelligence dashboard for DPA operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased command-center-bg min-h-screen`}
      >
        <QueryProvider>
          <header className="p-4 border-b border-dpa-green/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-dpa-green rounded-lg flex items-center justify-center">
                  <span className="font-orbitron font-bold text-white text-lg">DPA</span>
                </div>
                <h1 className="font-orbitron text-2xl font-bold text-white">
                  Command Center
                </h1>
              </div>
              <nav className="flex gap-4">
                <a 
                  href="/" 
                  className="px-4 py-2 rounded-lg border border-dpa-green/30 text-dpa-cyan hover:bg-dpa-green/20 transition-colors font-orbitron"
                >
                  Dashboard
                </a>
                <a 
                  href="/admin" 
                  className="px-4 py-2 rounded-lg border border-dpa-green/30 text-dpa-cyan hover:bg-dpa-green/20 transition-colors font-orbitron"
                >
                  Admin
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
