import mongoose from "mongoose"

const seasonSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    year: { type: Number, required: true, index: true },
    status: {
      type: String,
      enum: ["draft", "open", "closed", "archived"],
      default: "draft",
      index: true,
    },
    isActiveRegistrationSeason: { type: Boolean, default: false, index: true },
    registrationOpensAt: { type: Date },
    registrationClosesAt: { type: Date },
  },
  { timestamps: true }
)

export default mongoose.models.Season || mongoose.model("Season", seasonSchema)
