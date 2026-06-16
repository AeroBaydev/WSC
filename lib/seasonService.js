import dbConnect from "./dbConnect.js"
import Season from "./seasonModel.js"

export async function getActiveSeason() {
  await dbConnect()

  const slugOverride = process.env.ACTIVE_SEASON_SLUG?.trim()
  const query = slugOverride
    ? { slug: slugOverride }
    : { isActiveRegistrationSeason: true, status: "open" }

  const season = await Season.findOne(query).lean()
  if (!season) {
    const err = new Error("No active registration season is configured.")
    err.code = "NO_ACTIVE_SEASON"
    throw err
  }

  const now = new Date()
  if (season.registrationOpensAt && now < new Date(season.registrationOpensAt)) {
    const err = new Error("Registration has not opened yet for the current season.")
    err.code = "REGISTRATION_NOT_OPEN_YET"
    throw err
  }
  if (season.registrationClosesAt && now > new Date(season.registrationClosesAt)) {
    const err = new Error("Registration is closed for the current season.")
    err.code = "REGISTRATION_CLOSED"
    throw err
  }

  return season
}

/** Returns null instead of throwing when no active season exists. */
export async function getActiveSeasonOptional() {
  try {
    return await getActiveSeason()
  } catch (err) {
    if (
      err.code === "NO_ACTIVE_SEASON" ||
      err.code === "REGISTRATION_NOT_OPEN_YET" ||
      err.code === "REGISTRATION_CLOSED"
    ) {
      return null
    }
    throw err
  }
}

export function formatSeasonSummary(season) {
  if (!season) return null
  return {
    id: String(season._id),
    slug: season.slug,
    year: season.year,
    name: season.name,
  }
}
