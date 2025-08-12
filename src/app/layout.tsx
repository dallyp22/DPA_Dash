import type { Metadata } from "next";
import { Montserrat, Raleway } from "next/font/google";
import Link from "next/link";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
        className={`${montserrat.variable} ${raleway.variable} antialiased command-center-bg min-h-screen font-montserrat`}
      >
        <QueryProvider>
          <header className="p-4 border-b border-dpa-green/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-dpa-green rounded-lg flex items-center justify-center">
                  <span className="font-raleway font-black text-white text-lg">DPA</span>
                </div>
                <h1 className="font-raleway text-2xl font-bold text-white">
                  Command Center
                </h1>
              </div>
              <nav className="flex gap-4">
                <Link 
                  href="/" 
                  className="px-4 py-2 rounded-lg border border-dpa-light-green/30 text-dpa-green-readable hover:bg-dpa-green/20 transition-colors font-raleway"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/budget" 
                  className="px-4 py-2 rounded-lg border border-dpa-light-green/30 text-dpa-green-readable hover:bg-dpa-green/20 transition-colors font-raleway"
                >
                  Budget
                </Link>
                <Link 
                  href="/admin" 
                  className="px-4 py-2 rounded-lg border border-dpa-light-green/30 text-dpa-green-readable hover:bg-dpa-green/20 transition-colors font-raleway"
                >
                  Admin
                </Link>
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
