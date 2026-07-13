import {NextConfig} from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/lang/request.ts")

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.10.10.*"],
  async headers() {
    return [
      // M5: HTTP security headers — applied globally to all routes
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      // Note: Strict-Transport-Security is omitted — Vercel adds it automatically
      {
        source: "/:path*\\.(png|jpg|jpeg|webp|svg|ico|webm|mov|woff2|woff)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, must-revalidate",
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
