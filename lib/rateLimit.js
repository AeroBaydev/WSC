/**
 * Optional Upstash Redis rate limiting for serverless routes.
 * Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to enable.
 * When unset, requests pass through (add env vars in production).
 */

let ratelimitModule = null

async function getRatelimit(limit, windowSec) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  if (!ratelimitModule) {
    try {
      const { Ratelimit } = await import("@upstash/ratelimit")
      const { Redis } = await import("@upstash/redis")
      const redis = Redis.fromEnv()
      ratelimitModule = { Ratelimit, redis }
    } catch {
      return null
    }
  }
  const { Ratelimit, redis } = ratelimitModule
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
    analytics: false,
  })
}

export async function checkRateLimit(key, { limit = 10, windowSec = 60 } = {}) {
  const rl = await getRatelimit(limit, windowSec)
  if (!rl) return { success: true, skipped: true }

  const result = await rl.limit(key)
  return { success: result.success, remaining: result.remaining, skipped: false }
}

export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") || "unknown"
}
