import { Geist } from "next/font/google"

import { ClientProviders } from "@/providers"
import "@/styles/globals.css"
import { Metadata } from "next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Daniel González | Frontend Engineer",
  description: "Interactive portfolio and AI assistant for Daniel González, Frontend Engineer.",
}

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.className} antialiased`}>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
