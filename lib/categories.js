/** SoarFest category display names (must match lib/pricing.js keys). */
const SOARFEST_CATEGORIES = new Set([
  "Wing-shot Championship",
  "RocketMania",
  "DroneX Kids",
  "Wing Warriors",
  "Throttle Titans",
  "DroneX",
])

export function getEventType(category) {
  return SOARFEST_CATEGORIES.has(category) ? "soarfest" : "experiencex"
}

export { SOARFEST_CATEGORIES }
