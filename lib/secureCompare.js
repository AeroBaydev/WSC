import crypto from "node:crypto"

/** Timing-safe string comparison for secrets and HMAC signatures. */
export function secureCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}
