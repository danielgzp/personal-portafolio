import { Redis } from "@upstash/redis"

/**
 * Singleton Redis client for Upstash.
 *
 * WHY a singleton?
 * In serverless environments (Vercel), each API request can spin up a new
 * instance of your code. By creating the client at module level, Node.js
 * caches it — so if the same "warm" instance handles multiple requests,
 * they all reuse the same client instead of creating a new one each time.
 *
 * WHY HTTP (REST) instead of TCP?
 * Traditional Redis clients use persistent TCP connections. In serverless,
 * those connections get killed between invocations, causing errors.
 * Upstash's client uses plain HTTP fetch() under the hood — no connection
 * pooling, no socket management, works everywhere (Edge, Lambda, Vercel).
 *
 * The `url` and `token` come from your Upstash dashboard after creating
 * a Redis database. They authenticate your app with your specific instance.
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})
