import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientPage from "./ClientPage"

const inter = Inter({ subsets: ["latin"] })

// تحديث عنوان الموقع والوصف
export const metadata: Metadata = {
  title: "Offers Shop | Premium Cameras, Bags & Accessories",
  description: "Shop the latest cameras, bags, and accessories for tech enthusiasts and fashion-forward individuals.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientPage>{children}</ClientPage>
      </body>
    </html>
  )
}


import './globals.css'