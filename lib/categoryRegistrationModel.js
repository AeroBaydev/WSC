import mongoose from "mongoose"

const categoryRegistrationSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, index: true },
    email: { type: String, required: true },

    seasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      index: true,
    },
    seasonYear: { type: Number, index: true },
    seasonSlug: { type: String },
    seasonName: { type: String },

    category: { type: String, required: true, index: true },
    eventType: { type: String, enum: ["experiencex", "soarfest"] },

    paymentStatus: { type: String, default: "pending", index: true },
    paymentAmount: { type: String },
    transactionId: { type: String },
    paymentLinkId: { type: String, index: true },
    paymentOrderId: { type: String },
    registeredAt: { type: Date, default: Date.now },

    formData: { type: mongoose.Schema.Types.Mixed },
    couponCode: { type: String },
    basePricePaise: { type: Number },
    finalPricePaise: { type: Number },
    discountApplied: { type: Boolean, default: false },
    discountReason: { type: String },

    zohoFormData: { type: mongoose.Schema.Types.Mixed },
    zohoSheetSyncedAt: { type: Date },
    zohoSheetLastError: { type: String },
  },
  { timestamps: true }
)

/**
 * Season-aware unique constraint. Requires running:
 *   npm run migrate:seasons:all
 *   npm run migrate:seasons:swap-indexes
 *
 * The legacy { clerkUserId, category } unique index is dropped by the migration script.
 */
categoryRegistrationSchema.index(
  { clerkUserId: 1, seasonId: 1, category: 1 },
  { unique: true, name: "uniq_user_season_category" }
)
categoryRegistrationSchema.index(
  { clerkUserId: 1, seasonYear: -1, registeredAt: -1 },
  { name: "user_history_by_season" }
)
categoryRegistrationSchema.index(
  { seasonId: 1, paymentStatus: 1, category: 1 },
  { name: "season_admin_report" }
)

export default mongoose.models.CategoryRegistration ||
  mongoose.model("CategoryRegistration", categoryRegistrationSchema)
