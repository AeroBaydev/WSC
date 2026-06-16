import CategoryRegistration from "./categoryRegistrationModel.js"
import { getActiveSeason, getActiveSeasonOptional } from "./seasonService.js"
import { getEventType } from "./categories.js"

const SUCCESS_STATUSES = new Set(["success", "successful", "completed", "complete", "paid"])

export function isSuccessfulPayment(status) {
  return SUCCESS_STATUSES.has(String(status || "").trim().toLowerCase())
}

export async function findRegistrationForSeason({ clerkUserId, seasonId, category }) {
  return CategoryRegistration.findOne({ clerkUserId, seasonId, category })
}

export async function assertCanRegister({ clerkUserId, category }) {
  const season = await getActiveSeason()
  const existing = await findRegistrationForSeason({
    clerkUserId,
    seasonId: season._id,
    category,
  })

  if (existing && isSuccessfulPayment(existing.paymentStatus)) {
    return {
      allowed: false,
      season,
      existing,
      message: `Already registered for ${category} in ${season.name}.`,
    }
  }

  return { allowed: true, season, existing: existing || null }
}

export function buildRegistrationCreatePayload({ clerkUserId, email, category, season }) {
  return {
    clerkUserId,
    email,
    category,
    seasonId: season._id,
    seasonYear: season.year,
    seasonSlug: season.slug,
    seasonName: season.name,
    eventType: getEventType(category),
    paymentStatus: "initiated",
  }
}

export function applySeasonFieldsToRegistration(registration, season) {
  registration.seasonId = season._id
  registration.seasonYear = season.year
  registration.seasonSlug = season.slug
  registration.seasonName = season.name
  if (!registration.eventType) {
    registration.eventType = getEventType(registration.category)
  }
}

export async function getCurrentSeasonRegistrations(clerkUserId) {
  const season = await getActiveSeasonOptional()
  if (!season) {
    return { season: null, registrations: [] }
  }

  const registrations = await CategoryRegistration.find({
    clerkUserId,
    seasonId: season._id,
  })
    .select("category paymentStatus registeredAt seasonYear formData.teamName formData.members")
    .lean()

  return { season, registrations }
}

export async function getRegistrationHistory(clerkUserId) {
  return CategoryRegistration.find({ clerkUserId })
    .sort({ seasonYear: -1, registeredAt: -1 })
    .select(
      "seasonYear seasonName seasonSlug category eventType paymentStatus registeredAt formData transactionId finalPricePaise couponCode"
    )
    .lean()
}

export function groupRegistrationsBySeason(rows, activeSeason) {
  const bySeason = {}

  for (const reg of rows) {
    const key = reg.seasonYear
    if (!bySeason[key]) {
      bySeason[key] = {
        seasonYear: reg.seasonYear,
        seasonName: reg.seasonName || `Season ${reg.seasonYear}`,
        seasonSlug: reg.seasonSlug,
        isActive: activeSeason?.year === reg.seasonYear,
        registrations: [],
      }
    }

    bySeason[key].registrations.push({
      category: reg.category,
      eventType: reg.eventType,
      paymentStatus: reg.paymentStatus,
      isPaid: isSuccessfulPayment(reg.paymentStatus),
      registeredAt: reg.registeredAt,
      teamName: reg.formData?.teamName,
      members: reg.formData?.members,
      schoolName: reg.formData?.schoolName,
      ageCategory: reg.formData?.ageCategory,
      classStd: reg.formData?.classStd,
      transactionId: reg.transactionId,
      amountPaidPaise: reg.finalPricePaise,
      couponCode: reg.couponCode,
    })
  }

  return Object.values(bySeason).sort((a, b) => b.seasonYear - a.seasonYear)
}
