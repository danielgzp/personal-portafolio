import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "@/lib/redis"

/**
 * Rate limiter instance using a Sliding Window algorithm.
 *
 * WHAT IS SLIDING WINDOW?
 * Imagine a 60-second window that "slides" with time. At any given moment,
 * the algorithm looks at the last 60 seconds and counts how many requests
 * were made. If >= 10, the next request is rejected.
 *
 * WHY not Fixed Window?
 * Fixed Window divides time into rigid 60s blocks (0:00-1:00, 1:00-2:00...).
 * Problem: a user could send 10 requests at 0:59 and 10 more at 1:01 —
 * that's 20 requests in 2 seconds, all "legal". Sliding Window prevents
 * this by always looking at the trailing 60 seconds.
 *
 * HOW does it work with Redis?
 * Upstash stores a counter per time bucket in Redis. On each request,
 * it checks the weighted count across the current and previous bucket.
 * All of this happens in a single HTTP roundtrip to Upstash.
 *
 * CONFIG:
 * - 10 requests per 1 minute per unique client identifier
 * - prefix "ratelimit:chat" namespaces the keys in Redis
 * - analytics: true enables the Upstash Console dashboard
 */
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  prefix: "ratelimit:chat",
  analytics: true,
})

/**
 * Build a stable client identifier from IP + User-Agent.
 *
 * WHY IP + User-Agent?
 * Since there's no user authentication in the portfolio, we can't identify
 * users by session or token. IP alone is too coarse (shared WiFi, VPNs),
 * so we combine it with User-Agent to create a more granular fingerprint.
 *
 * HOW does x-forwarded-for work?
 * When your app runs behind a reverse proxy (Vercel, Cloudflare, Nginx),
 * the client's real IP isn't in the TCP connection — the proxy's IP is.
 * The proxy adds the original IP to the "x-forwarded-for" header.
 * Format: "client_ip, proxy1_ip, proxy2_ip" — we take the first one.
 *
 * FALLBACK:
 * If no IP is available (local dev without proxy), we use "anonymous".
 * This means all local requests share the same limit — acceptable for dev.
 */
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || "anonymous"
  const ua = req.headers.get("user-agent") || "unknown"
  return `${ip}:${ua}`
}

/**
 * Build standard HTTP rate-limit headers from the Upstash result.
 *
 * These headers follow the IETF draft standard (draft-ietf-httpapi-ratelimit-headers)
 * and help clients understand:
 * - X-RateLimit-Limit: total allowed requests in the window (10)
 * - X-RateLimit-Remaining: how many requests are left before hitting the limit
 * - X-RateLimit-Reset: Unix timestamp (ms) when the window resets
 * - Retry-After: seconds until the client should retry (required by HTTP 429 spec)
 */
export function buildRateLimitHeaders(limit: number, remaining: number, reset: number): Record<string, string> {
  const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
    "Retry-After": retryAfterSeconds.toString(),
  }
}

export { ratelimit }
