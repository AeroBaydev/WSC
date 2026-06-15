import getCouponsConfig from './coupons-config.js';
import { isCouponRedemptionAvailable } from './couponRedemption.js';

export async function validateAndPriceWithCoupon({ category, basePricePaise, couponCode }) {
  if (!couponCode) {
    return { finalPricePaise: basePricePaise, applied: false, reason: 'no_code' };
  }

  const code = String(couponCode).trim().toUpperCase();
  const coupons = getCouponsConfig();
  const coupon = coupons.find((c) => c.code === code && c.active !== false);

  if (!coupon || !coupon.active) {
    return { finalPricePaise: basePricePaise, applied: false, reason: 'invalid' };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { finalPricePaise: basePricePaise, applied: false, reason: 'expired' };
  }

  const redemption = await isCouponRedemptionAvailable(code);
  if (!redemption.available) {
    return { finalPricePaise: basePricePaise, applied: false, reason: 'max_redemptions_reached' };
  }

  if (Array.isArray(coupon.allowedCategories) && coupon.allowedCategories.length > 0) {
    if (!coupon.allowedCategories.includes(category)) {
      return { finalPricePaise: basePricePaise, applied: false, reason: 'not_allowed_for_category' };
    }
  }

  let discounted = basePricePaise;
  if (coupon.discountType === 'flat') {
    discounted = Math.max(0, basePricePaise - Math.round(coupon.amount * 100));
  } else if (coupon.discountType === 'percent') {
    const percent = Math.min(100, Math.max(0, coupon.amount));
    discounted = Math.round(basePricePaise * (1 - percent / 100));
  }

  return { finalPricePaise: discounted, applied: true, coupon };
}


