"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { useEffect, useState } from "react"
import "./globals.css"
import ClientLayout from "./ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export default function ClientPage({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState<string>("")

  useEffect(() => {
    // Load Google Analytics ID from settings
    try {
      const storedSettings = localStorage.getItem("siteSettings")
      if (storedSettings) {
        const settings = JSON.parse(storedSettings)
        if (settings.seo?.googleAnalyticsId) {
          setGoogleAnalyticsId(settings.seo.googleAnalyticsId)
        }
      }
    } catch (error) {
      console.error("Error loading Google Analytics ID:", error)
    }
  }, [])

  return (
    <ClientLayout googleAnalyticsId={googleAnalyticsId}>
      <main className={inter.className}>{children}</main>
    </ClientLayout>
  )
}
