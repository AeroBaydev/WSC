import dbConnect from "./dbConnect.js"
import Coupon from "./couponModel.js"
import getCouponsConfig from "./coupons-config.js"

const DEFAULT_MAX_REDEMPTIONS = Number(process.env.COUPON_DEFAULT_MAX_REDEMPTIONS || 50)

function getConfigCoupon(code) {
  const normalized = String(code).trim().toUpperCase()
  return getCouponsConfig().find((c) => c.code === normalized)
}

export async function getCouponRedemptionCount(code) {
  await dbConnect()
  const normalized = String(code).trim().toUpperCase()
  const doc = await Coupon.findOne({ code: normalized }).select("redeemedCount").lean()
  return doc?.redeemedCount ?? 0
}

export async function isCouponRedemptionAvailable(code) {
  const configCoupon = getConfigCoupon(code)
  if (!configCoupon) return { available: true }

  const max =
    typeof configCoupon.maxRedemptions === "number"
      ? configCoupon.maxRedemptions
      : DEFAULT_MAX_REDEMPTIONS

  if (max <= 0) return { available: true }

  const used = await getCouponRedemptionCount(code)
  return { available: used < max, used, max }
}

/** Atomically increment redemption count after confirmed payment. Idempotent per registrationId. */
export async function confirmCouponRedemption(code, registrationId) {
  if (!code) return { ok: true, skipped: true }

  const configCoupon = getConfigCoupon(code)
  if (!configCoupon) return { ok: true, skipped: true }

  const normalized = String(code).trim().toUpperCase()
  const max =
    typeof configCoupon.maxRedemptions === "number"
      ? configCoupon.maxRedemptions
      : DEFAULT_MAX_REDEMPTIONS

  await dbConnect()

  const existing = await Coupon.findOne({
    code: normalized,
    redeemedRegistrationIds: registrationId,
  }).lean()
  if (existing) return { ok: true, duplicate: true }

  const update = {
    $inc: { redeemedCount: 1 },
    $addToSet: { redeemedRegistrationIds: String(registrationId) },
    $setOnInsert: {
      code: normalized,
      discountType: configCoupon.discountType,
      amount: configCoupon.amount,
      active: configCoupon.active !== false,
      expiresAt: configCoupon.expiresAt,
      maxRedemptions: max,
      allowedCategories: configCoupon.allowedCategories,
    },
  }

  const doc = await Coupon.findOneAndUpdate({ code: normalized }, update, {
    upsert: true,
    new: true,
  })

  if (max > 0 && doc.redeemedCount > max) {
    await Coupon.findOneAndUpdate(
      { code: normalized },
      { $inc: { redeemedCount: -1 }, $pull: { redeemedRegistrationIds: String(registrationId) } }
    )
    return { ok: false, reason: "max_redemptions_exceeded" }
  }

  return { ok: true }
}
