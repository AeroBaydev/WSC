import mongoose from 'mongoose';

const categoryRegistrationSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  paymentStatus: { type: String, default: 'pending' },
  paymentAmount: { type: String },
  transactionId: { type: String },
  paymentLinkId: { type: String },
  paymentOrderId: { type: String },
  registeredAt: { type: Date, default: Date.now },
  // Raw form data collected in our app (team details, contacts, etc.)
  formData: { type: mongoose.Schema.Types.Mixed },
  couponCode: { type: String },
  basePricePaise: { type: Number },
  finalPricePaise: { type: Number },
  discountApplied: { type: Boolean, default: false },
  discountReason: { type: String },

  // Legacy: Store all Zoho form data (if still used anywhere)
  zohoFormData: { type: mongoose.Schema.Types.Mixed },

  // Sync status to Zoho Sheet (via webhook/API)
  zohoSheetSyncedAt: { type: Date },
  zohoSheetLastError: { type: String }
}, { timestamps: true });

// Create compound index to prevent duplicate registrations
categoryRegistrationSchema.index({ clerkUserId: 1, category: 1 }, { unique: true });
categoryRegistrationSchema.index({ paymentLinkId: 1 });

export default mongoose.models.CategoryRegistration || mongoose.model('CategoryRegistration', categoryRegistrationSchema);
