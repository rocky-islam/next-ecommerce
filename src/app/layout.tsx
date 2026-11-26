import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KINETIC // ATELIER | Contemporary Footwear Studio",
  description:
    "Independent contemporary footwear studio featuring certified men's, women's, and youth footwear collections with official BDT pricing and express nationwide delivery.",
  keywords: [
    "Footwear",
    "Shoes",
    "Leather Shoes",
    "Loafers",
    "Sandals",
    "Bangladesh Footwear",
    "Bespoke Footwear",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "KINETIC // ATELIER | Contemporary Footwear Studio",
    description:
      "Independent contemporary footwear studio featuring certified footwear collections with express nationwide delivery.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#171717] font-sans selection:bg-neutral-900 selection:text-white">
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
