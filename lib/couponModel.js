import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['flat', 'percent'], required: true },
  amount: { type: Number, required: true },
  active: { type: Boolean, default: true },
  expiresAt: { type: Date },
  maxRedemptions: { type: Number },
  redeemedCount: { type: Number, default: 0 },
  redeemedRegistrationIds: [{ type: String }],
  allowedCategories: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);


