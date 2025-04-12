"use client"

import type React from "react"
import Script from "next/script"
import { CartProvider } from "@/lib/cart-context"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

interface RootLayoutProps {
  children: React.ReactNode
  googleAnalyticsId: string
}

export default function ClientLayout({ children, googleAnalyticsId }: RootLayoutProps) {
  return (
    <>
      {/* Google Analytics Script */}
      {googleAnalyticsId && googleAnalyticsId.startsWith("G-") && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {/* Universal Analytics (older version) */}
      {googleAnalyticsId && googleAnalyticsId.startsWith("UA-") && (
        <Script id="universal-analytics" strategy="afterInteractive">
          {`
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
            
            ga('create', '${googleAnalyticsId}', 'auto');
            ga('send', 'pageview');
          `}
        </Script>
      )}

      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow">{children}</div>
            <Footer />
          </div>
          <Toaster />
        </CartProvider>
      </ThemeProvider>
    </>
  )
}
