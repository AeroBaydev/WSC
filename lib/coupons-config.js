// Source of truth for coupons without using a database.
// You can deploy code changes to update this list, or override at runtime with COUPONS_JSON.

function parseCouponsFromEnv() {
  try {
    const raw = process.env.COUPONS_JSON;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed?.coupons)) return parsed.coupons;
    return null;
  } catch (_) {
    return null;
  }
}

const defaultCoupons = [

  // Founder's Coupon Code
  { code: 'NEHA20', discountType: 'percent', amount: 20, active: true },
  { code: 'VAISHNAV20', discountType: 'percent', amount: 20, active: true },
  { code: 'ASHISH20', discountType: 'percent', amount: 20, active: true },
  { code: 'NITIN20', discountType: 'percent', amount: 20, active: true },

  // HEAD STAFF
  { code: 'AADI20', discountType: 'percent', amount: 20, active: true },
  { code: 'MANISHA20', discountType: 'percent', amount: 20, active: true },
  { code: 'XNKR20', discountType: 'percent', amount: 20, active: true },
  { code: 'SWAP20', discountType: 'percent', amount: 20, active: true },
  

  // Manglesh Sir's coupon code
  { code: 'MP20', discountType: 'percent', amount: 20, active: true },
  { code: 'MMP30', discountType: 'percent', amount: 30, active: true },

  // Ravi Sir's Coupon Code
  { code: 'RK20', discountType: 'percent', amount: 20, active: true },
  { code: 'RK40', discountType: 'percent', amount: 40, active: true },
  { code: 'RK50', discountType: 'percent', amount: 50, active: true },
  { code: 'RK60', discountType: 'percent', amount: 60, active: true },

  // Channel Partner's Coupon Code
  // 1.TRAUN GHOSH 
  { code: 'TG20', discountType: 'percent', amount: 20, active: true },
  // 2.PRHALAD SINGH
  { code: 'PH20', discountType: 'percent', amount: 20, active: true },
  // 3.SAHIL
  { code: 'SAHIL20', discountType: 'percent', amount: 20, active: true },
   // 4.sANDEEP GULATI
   { code: 'SG20', discountType: 'percent', amount: 20, active: true },

  
  // Shivashish sir's               taem coupon code
  { code: 'ARB40', discountType: 'percent', amount: 40, active: true },
  { code: 'SMB40', discountType: 'percent', amount: 40, active: true },
  { code: 'PKB40', discountType: 'percent', amount: 40, active: true },
  { code: 'AGL40', discountType: 'percent', amount: 40, active: true },
  { code: 'TSL40', discountType: 'percent', amount: 40, active: true },
  { code: 'APL40', discountType: 'percent', amount: 40, active: true },
  { code: 'ASR40', discountType: 'percent', amount: 40, active: true },
  { code: 'PSG40', discountType: 'percent', amount: 40, active: true },
  { code: 'DKGN40', discountType: 'percent', amount: 40, active: true },
  { code: 'MKRN40', discountType: 'percent', amount: 40, active: true },
  { code: 'SPRN40', discountType: 'percent', amount: 40, active: true },
  { code: 'SKD40', discountType: 'percent', amount: 40, active: true },
  { code: 'AGD40', discountType: 'percent', amount: 40, active: true },
  { code: 'AYK40', discountType: 'percent', amount: 40, active: true },
  { code: 'ATJ40', discountType: 'percent', amount: 40, active: true },
  { code: 'ABKJ40', discountType: 'percent', amount: 40, active: true },
  { code: 'SWJ40', discountType: 'percent', amount: 40, active: true },
  { code: 'DSP40', discountType: 'percent', amount: 40, active: true },
  { code: 'BRSS40', discountType: 'percent', amount: 40, active: true },
  { code: 'SRS40', discountType: 'percent', amount: 40, active: true },
  { code: 'RJS40', discountType: 'percent', amount: 40, active: true },
  { code: 'TMN40', discountType: 'percent', amount: 40, active: true },
  { code: 'SSB40', discountType: 'percent', amount: 40, active: true },
  { code: 'MAHI40', discountType: 'percent', amount: 40, active: true },
  { code: 'GKK40', discountType: 'percent', amount: 40, active: true },
  { code: 'MKGN40', discountType: 'percent', amount: 40, active: true },
  { code: 'AKO40', discountType: 'percent', amount: 40, active: true },
  { code: 'SDP40', discountType: 'percent', amount: 40, active: true },
  { code: 'SV40', discountType: 'percent', amount: 40, active: true },
  { code: 'SSR40', discountType: 'percent', amount: 40, active: true },
  { code: 'AMB40', discountType: 'percent', amount: 40, active: true },
  { code: 'NJK40', discountType: 'percent', amount: 40, active: true },
  { code: 'SGB40', discountType: 'percent', amount: 40, active: true },
  { code: 'HMM40', discountType: 'percent', amount: 40, active: true },
  { code: 'SNV40', discountType: 'percent', amount: 40, active: true },
  { code: 'AKB40', discountType: 'percent', amount: 40, active: true },
  { code: 'NBS40', discountType: 'percent', amount: 40, active: true },
  { code: 'VBC40', discountType: 'percent', amount: 40, active: true },
  { code: 'SSJ40', discountType: 'percent', amount: 40, active: true },
  { code: 'ARG40', discountType: 'percent', amount: 40, active: true },
  { code: 'ASF40', discountType: 'percent', amount: 40, active: true },
  { code: 'RKR40', discountType: 'percent', amount: 40, active: true },
  { code: 'AAR40', discountType: 'percent', amount: 40, active: true },
  { code: 'GGR40', discountType: 'percent', amount: 40, active: true },
  { code: 'NRR40', discountType: 'percent', amount: 40, active: true },
  { code: 'UYR40', discountType: 'percent', amount: 40, active: true },
  { code: 'ABR40', discountType: 'percent', amount: 40, active: true },
  { code: 'SKB40', discountType: 'percent', amount: 40, active: true },
  { code: 'AG40', discountType: 'percent', amount: 40, active: true },
  { code: 'SJM40', discountType: 'percent', amount: 40, active: true },

  // Ashwani sir's team Coupon 
  { code: 'SVC40', discountType: 'percent', amount: 40, active: true },
  { code: 'PTM40', discountType: 'percent', amount: 40, active: true },
  { code: 'NAS40', discountType: 'percent', amount: 40, active: true },
  { code: 'RAP40', discountType: 'percent', amount: 40, active: true },
  { code: 'ANR40', discountType: 'percent', amount: 40, active: true },
  { code: 'PMS40', discountType: 'percent', amount: 40, active: true },
  { code: 'SIP40', discountType: 'percent', amount: 40, active: true },
  { code: 'SIK40', discountType: 'percent', amount: 40, active: true },
  { code: 'MNP40', discountType: 'percent', amount: 40, active: true },
  { code: 'STK40', discountType: 'percent', amount: 40, active: true },
  { code: 'AAA40', discountType: 'percent', amount: 40, active: true },
  { code: 'PYP40', discountType: 'percent', amount: 40, active: true },
  { code: 'STS40', discountType: 'percent', amount: 40, active: true },
  { code: 'VIK40', discountType: 'percent', amount: 40, active: true },
  { code: 'SLK40', discountType: 'percent', amount: 40, active: true },
  { code: 'AAK40', discountType: 'percent', amount: 40, active: true },
  { code: 'KLN40', discountType: 'percent', amount: 40, active: true },
  { code: 'SHU40', discountType: 'percent', amount: 40, active: true },
  { code: 'VAY40', discountType: 'percent', amount: 40, active: true },
  { code: 'SUB40', discountType: 'percent', amount: 40, active: true },
  { code: 'HIK40', discountType: 'percent', amount: 40, active: true },
  { code: 'SHR40', discountType: 'percent', amount: 40, active: true },
  { code: 'PVP40', discountType: 'percent', amount: 40, active: true },
  { code: 'DUS40', discountType: 'percent', amount: 40, active: true },
  { code: 'SLP40', discountType: 'percent', amount: 40, active: true },
  { code: 'RLK40', discountType: 'percent', amount: 40, active: true },
  { code: 'RTD40', discountType: 'percent', amount: 40, active: true },
  { code: 'SMK40', discountType: 'percent', amount: 40, active: true },
  { code: 'SMS40', discountType: 'percent', amount: 40, active: true },
  { code: 'PEV40', discountType: 'percent', amount: 40, active: true },
  { code: 'KLM40', discountType: 'percent', amount: 40, active: true },
  { code: 'RAK40', discountType: 'percent', amount: 40, active: true },
  { code: 'AHW40', discountType: 'percent', amount: 40, active: true },
  { code: 'HTM40', discountType: 'percent', amount: 40, active: true },
  { code: 'BVS40', discountType: 'percent', amount: 40, active: true },
  { code: 'NVK40', discountType: 'percent', amount: 40, active: true },
  { code: 'PTC40', discountType: 'percent', amount: 40, active: true },
  { code: 'SYG40', discountType: 'percent', amount: 40, active: true },
  { code: 'AKV40', discountType: 'percent', amount: 40, active: true },
  { code: 'ATK40', discountType: 'percent', amount: 40, active: true },
  { code: 'RLP40', discountType: 'percent', amount: 40, active: true },
  { code: 'PNM40', discountType: 'percent', amount: 40, active: true },
  { code: 'RUE40', discountType: 'percent', amount: 40, active: true },
  { code: 'AYC40', discountType: 'percent', amount: 40, active: true },
  { code: 'HHS40', discountType: 'percent', amount: 40, active: true },
  { code: 'ANG40', discountType: 'percent', amount: 40, active: true },
  { code: 'MSJ40', discountType: 'percent', amount: 40, active: true },
  { code: 'GMH40', discountType: 'percent', amount: 40, active: true },
  { code: 'ALM40', discountType: 'percent', amount: 40, active: true },
  { code: 'AYA40', discountType: 'percent', amount: 40, active: true },


  
  // POC"S and other staff
  { code: 'NSR20', discountType: 'percent', amount: 20, active: true },
  { code: 'BARATH20', discountType: 'percent', amount: 20, active: true },
  { code: 'ASHES20', discountType: 'percent', amount: 20, active: true },
  { code: 'SHIVA20', discountType: 'percent', amount: 20, active: true },
  { code: 'RHLRNR20', discountType: 'percent', amount: 20, active: true },
  { code: 'SAUMYA20', discountType: 'percent', amount: 20, active: true },
  { code: 'VISH20', discountType: 'percent', amount: 20, active: true },

  // GDG Silliguri
  { code: 'GDGSB40', discountType: 'percent', amount: 40, active: true },

  // Prominance
  { code: 'PMN20', discountType: 'percent', amount: 20, active: true },
  //Allenhouse Rooma
  { code: 'AHRL20', discountType: 'percent', amount: 20, active: true },
  //Calcutta Public School Kalikapur
  { code: 'CPSK20', discountType: 'percent', amount: 20, active: true },
  //GD Goenka Shahjahanpur
  { code: 'GDGSP40', discountType: 'percent', amount: 40, active: true },
  { code: 'GDGSP30', discountType: 'percent', amount: 30, active: true },

];

export function getCouponsConfig() {
  const fromEnv = parseCouponsFromEnv();
  const list = Array.isArray(fromEnv) ? fromEnv : defaultCoupons;
  // Normalize
  return list
    .filter((c) => c && c.code && c.discountType && typeof c.amount === 'number')
    .map((c) => ({
      code: String(c.code).trim().toUpperCase(),
      discountType: c.discountType,
      amount: c.amount,
      active: c.active !== false,
      expiresAt: c.expiresAt ? new Date(c.expiresAt) : undefined,
      maxRedemptions: c.maxRedemptions,
      redeemedCount: c.redeemedCount || 0,
      allowedCategories: Array.isArray(c.allowedCategories) ? c.allowedCategories : undefined,
    }));
}

export default getCouponsConfig;


