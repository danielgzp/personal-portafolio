import {NextConfig} from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/lang/request.ts")

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.10.10.107"],
  experimental: {
  ppr: true,
},
  async headers() {
    return [
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
