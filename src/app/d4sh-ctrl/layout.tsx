import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { ClientProviders } from "@/providers"
import "@/styles/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Admin Panel — Chat Analytics",
  robots: { index: false, follow: false }, // No indexar
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geistSans.className} antialiased`}>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
