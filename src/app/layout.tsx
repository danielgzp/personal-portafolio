import { Geist } from "next/font/google"

import { ClientProviders } from "@/providers"
import "@/styles/globals.css"
import { Metadata } from "next"
import { getLocale } from "next-intl/server"
import { NextIntlClientProvider } from "next-intl"

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  return (
    <html lang={locale} suppressHydrationWarning className={`${geistSans.className} antialiased`}>
      <body>
        <NextIntlClientProvider>
          <ClientProviders>{children}</ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
