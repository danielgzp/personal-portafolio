import { Geist } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import "@/styles/globals.css"
import NotFoundComponent from "./[locale]/not-found"
import { ClientProviders } from "@/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export default async function GlobalNotFound() {
  // Provide messages for the default locale to render fallback 404
  const messages = await getMessages({ locale: "es" })

  return (
    <html lang="es" suppressHydrationWarning className={`${geistSans.className} antialiased`}>
      <body>
        <NextIntlClientProvider locale="es" messages={messages}>
          <ClientProviders>
            <NotFoundComponent />
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
