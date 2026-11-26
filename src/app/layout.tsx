import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import Script from "next/script";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { BackToTop } from "@/components/motion/BackToTop";
import { IntroCurtain, introScript } from "@/components/motion/IntroCurtain";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KINETIC // STUDIO | Contemporary Footwear",
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
    title: "KINETIC // STUDIO | Contemporary Footwear",
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
      // The intro script may set data-intro before hydration
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-[#171717] font-sans selection:bg-neutral-900 selection:text-white">
        {/* Without JS, scroll-reveal content must never stay hidden */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>[data-visible="false"],[data-visible="false"]>*,[data-visible="false"] .split-word,[data-visible="false"]>[data-image-reveal-inner],[data-scroll-text] .scroll-word{opacity:1!important;transform:none!important;clip-path:none!important}</style>`,
          }}
        />
        <Script id="intro-gate" strategy="beforeInteractive">
          {introScript}
        </Script>
        <IntroCurtain />
        <MotionProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <BackToTop />
            <CustomCursor />
          </CartProvider>
        </MotionProvider>
        {/* Film grain texture */}
        <div aria-hidden="true" className="grain" />
      </body>
    </html>
  );
}
