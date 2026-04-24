/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["10.10.10.107"],
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

export default nextConfig
