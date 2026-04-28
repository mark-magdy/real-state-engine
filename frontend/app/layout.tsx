import type { Metadata } from "next";
import { Nunito_Sans, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/shared/components/layout/Navbar";
import { Footer } from "@/shared/components/layout/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "REI Engine — Find Best Value Real Estate Investments",
    template: "%s | REI Engine",
  },
  description:
    "The ultimate platform for analyzing the best value real estate investments in Egypt. Find and compare properties across many websites from one place, calculate ROI, and get data-driven market insights.",
  keywords: ["real estate investment", "property search egypt", "ROI analysis", "real estate analytics", "property comparison"],
  authors: [{ name: "REI Engine Team" }],
  openGraph: {
    title: "REI Engine — Real Estate Investment Analytics",
    description: "Analyze the best value real estate investments and find properties across many websites from one place.",
    url: "https://realstate-engine.markmagdy.com/",
    siteName: "REI Engine",
    locale: "en_US",
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
      className={`${nunitoSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <TooltipProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
