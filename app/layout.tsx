import type React from "react"
import type { Metadata } from "next"
import { Comfortaa, Geist_Mono } from "next/font/google"
import "./globals.css"

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Simply Learn | Learn to Code",
  description: "Master coding the modern way with expertly crafted courses, modules, and hands-on lessons.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${comfortaa.variable} ${geistMono.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
