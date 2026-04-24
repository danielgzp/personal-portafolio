import { Geist, Geist_Mono } from "next/font/google"

import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { ClientProviders } from "@/providers"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

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
    <html lang="en" suppressHydrationWarning className={cn("antialiased", fontMono.variable, geist.variable)}>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
