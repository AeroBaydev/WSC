/**
 * Season migration for WSC CategoryRegistration records.
 *
 * All existing registrations (no seasonId) are treated as Season 2025.
 *
 * Usage:
 *   node scripts/migrate-seasons.mjs --dry-run
 *   node scripts/migrate-seasons.mjs --seed-seasons
 *   node scripts/migrate-seasons.mjs --backfill
 *   node scripts/migrate-seasons.mjs --verify
 *   node scripts/migrate-seasons.mjs --swap-indexes
 *   node scripts/migrate-seasons.mjs --all          # seed + backfill + verify (NOT swap)
 *
 * Recommended production order:
 *   1. mongodump backup
 *   2. node scripts/migrate-seasons.mjs --dry-run
 *   3. node scripts/migrate-seasons.mjs --all
 *   4. node scripts/migrate-seasons.mjs --swap-indexes
 */

import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import mongoose from "mongoose"

const SEASON_2025 = {
  slug: "wsc-2025",
  name: "World Skill Challenge 2025",
  year: 2025,
  status: "closed",
  isActiveRegistrationSeason: false,
}

const SEASON_2026 = {
  slug: "wsc-2026",
  name: "World Skill Challenge 2026",
  year: 2026,
  status: "open",
  isActiveRegistrationSeason: true,
}

const SOARFEST_CATEGORIES = [
  "Wing-shot Championship",
  "RocketMania",
  "DroneX Kids",
  "Wing Warriors",
  "Throttle Titans",
  "DroneX",
]

const LEGACY_UNIQUE_INDEX = "clerkUserId_1_category_1"
const NEW_UNIQUE_INDEX = "uniq_user_season_category"

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local")
  if (!existsSync(envPath)) {
    console.warn("⚠️  .env.local not found — using process.env.MONGODB_URI")
    return
  }

  const content = readFileSync(envPath, "utf8")
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

function parseArgs(argv) {
  const flags = new Set(argv.slice(2))
  return {
    dryRun: flags.has("--dry-run"),
    seedSeasons: flags.has("--seed-seasons") || flags.has("--all"),
    backfill: flags.has("--backfill") || flags.has("--all"),
    verify: flags.has("--verify") || flags.has("--all"),
    swapIndexes: flags.has("--swap-indexes"),
    help: flags.has("--help") || flags.has("-h"),
  }
}

function printHelp() {
  console.log(`
Season migration script

  --dry-run        Report counts only; no writes
  --seed-seasons   Upsert wsc-2025 (closed) and wsc-2026 (active)
  --backfill       Tag all registrations missing seasonId as Season 2025
  --verify         Fail if any registration still lacks seasonId
  --swap-indexes   Drop legacy unique index; create season-aware indexes
  --all            seed-seasons + backfill + verify (does NOT swap indexes)

Example:
  node scripts/migrate-seasons.mjs --dry-run
  node scripts/migrate-seasons.mjs --all
  node scripts/migrate-seasons.mjs --swap-indexes
`)
}

function legacyFilter() {
  return {
    $or: [{ seasonId: { $exists: false } }, { seasonId: null }],
  }
}

async function connect() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local or the environment.")
  }

  await mongoose.connect(uri, { bufferCommands: false, maxPoolSize: 5 })
  console.log("✅ Connected to MongoDB")
}

async function getModels() {
  const seasonSchema = new mongoose.Schema(
    {
      slug: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      year: { type: Number, required: true },
      status: {
        type: String,
        enum: ["draft", "open", "closed", "archived"],
        default: "draft",
      },
      isActiveRegistrationSeason: { type: Boolean, default: false },
      registrationOpensAt: Date,
      registrationClosesAt: Date,
    },
    { timestamps: true }
  )

  const registrationSchema = new mongoose.Schema({}, { strict: false, collection: "categoryregistrations" })

  const Season =
    mongoose.models.MigrationSeason || mongoose.model("MigrationSeason", seasonSchema, "seasons")
  const CategoryRegistration =
    mongoose.models.MigrationCategoryRegistration ||
    mongoose.model("MigrationCategoryRegistration", registrationSchema)

  return { Season, CategoryRegistration }
}

async function reportCounts(CategoryRegistration, Season) {
  const total = await CategoryRegistration.countDocuments({})
  const legacy = await CategoryRegistration.countDocuments(legacyFilter())
  const withSeason = total - legacy
  const season2025 = await Season.findOne({ slug: SEASON_2025.slug }).lean()
  const season2026 = await Season.findOne({ slug: SEASON_2026.slug }).lean()

  const indexes = await CategoryRegistration.collection.indexes()
  const indexNames = indexes.map((i) => i.name)

  console.log("\n📊 Migration report")
  console.log("─────────────────────────────────────")
  console.log(`Total registrations:        ${total}`)
  console.log(`Missing seasonId (→ 2025):  ${legacy}`)
  console.log(`Already have seasonId:      ${withSeason}`)
  console.log(`Season wsc-2025 exists:     ${season2025 ? "yes" : "no"}`)
  console.log(`Season wsc-2026 exists:     ${season2026 ? "yes" : "no"}`)
  console.log(`Legacy index present:       ${indexNames.includes(LEGACY_UNIQUE_INDEX) ? "yes" : "no"}`)
  console.log(`New unique index present:   ${indexNames.includes(NEW_UNIQUE_INDEX) ? "yes" : "no"}`)
  console.log("─────────────────────────────────────\n")

  if (legacy > 0) {
    const samples = await CategoryRegistration.find(legacyFilter())
      .sort({ createdAt: -1 })
      .limit(3)
      .select("clerkUserId category paymentStatus createdAt registeredAt")
      .lean()

    console.log("Sample records that would be backfilled as Season 2025:")
    for (const doc of samples) {
      console.log(
        `  - ${doc._id} | ${doc.category} | ${doc.paymentStatus} | user=${doc.clerkUserId?.slice(0, 12)}...`
      )
    }
    console.log("")
  }

  return { total, legacy, indexNames }
}

async function seedSeasons(Season, dryRun) {
  console.log("🌱 Seeding seasons...")

  if (dryRun) {
    console.log("   [dry-run] Would upsert wsc-2025 and wsc-2026")
    return { season2025: null, season2026: null }
  }

  const season2025 = await Season.findOneAndUpdate(
    { slug: SEASON_2025.slug },
    { $set: SEASON_2025 },
    { upsert: true, new: true }
  )

  const season2026 = await Season.findOneAndUpdate(
    { slug: SEASON_2026.slug },
    { $set: SEASON_2026 },
    { upsert: true, new: true }
  )

  await Season.updateMany(
    { slug: { $ne: SEASON_2026.slug } },
    { $set: { isActiveRegistrationSeason: false } }
  )
  await Season.updateOne({ slug: SEASON_2026.slug }, { $set: { isActiveRegistrationSeason: true } })

  console.log(`   ✓ Season 2025: ${season2025._id} (${season2025.slug})`)
  console.log(`   ✓ Season 2026: ${season2026._id} (${season2026.slug})`)

  return { season2025, season2026 }
}

async function backfillRegistrations(CategoryRegistration, season2025, dryRun) {
  const filter = legacyFilter()
  const count = await CategoryRegistration.countDocuments(filter)

  console.log(`📦 Backfilling ${count} registration(s) as Season 2025...`)

  if (count === 0) {
    console.log("   Nothing to backfill.")
    return { matched: 0, modified: 0 }
  }

  if (dryRun) {
    console.log("   [dry-run] Would set seasonId/seasonYear/seasonSlug/seasonName on all legacy records")
    return { matched: count, modified: 0 }
  }

  if (!season2025?._id) {
    throw new Error("Season 2025 not found. Run with --seed-seasons first.")
  }

  const seasonFields = {
    seasonId: season2025._id,
    seasonYear: SEASON_2025.year,
    seasonSlug: SEASON_2025.slug,
    seasonName: SEASON_2025.name,
  }

  const result = await CategoryRegistration.updateMany(filter, { $set: seasonFields })

  const soarfestResult = await CategoryRegistration.updateMany(
    {
      seasonId: season2025._id,
      category: { $in: SOARFEST_CATEGORIES },
      $or: [{ eventType: { $exists: false } }, { eventType: null }],
    },
    { $set: { eventType: "soarfest" } }
  )

  const experienceResult = await CategoryRegistration.updateMany(
    {
      seasonId: season2025._id,
      $or: [{ eventType: { $exists: false } }, { eventType: null }],
    },
    { $set: { eventType: "experiencex" } }
  )

  console.log(`   ✓ Season fields updated: ${result.modifiedCount}/${result.matchedCount}`)
  console.log(`   ✓ eventType soarfest:    ${soarfestResult.modifiedCount}`)
  console.log(`   ✓ eventType experiencex: ${experienceResult.modifiedCount}`)

  return result
}

async function verify(CategoryRegistration) {
  console.log("🔍 Verifying migration...")

  const remaining = await CategoryRegistration.countDocuments(legacyFilter())
  if (remaining > 0) {
    throw new Error(`${remaining} registration(s) still missing seasonId. Re-run --backfill.`)
  }

  const missingEventType = await CategoryRegistration.countDocuments({
    $or: [{ eventType: { $exists: false } }, { eventType: null }],
  })
  if (missingEventType > 0) {
    throw new Error(`${missingEventType} registration(s) still missing eventType. Re-run --backfill.`)
  }

  const season2025Count = await CategoryRegistration.countDocuments({ seasonYear: 2025 })
  console.log(`   ✓ All registrations have seasonId`)
  console.log(`   ✓ All registrations have eventType`)
  console.log(`   ✓ Registrations tagged seasonYear=2025: ${season2025Count}`)
}

async function listIndexes(CategoryRegistration) {
  const indexes = await CategoryRegistration.collection.indexes()
  console.log("\nCurrent indexes on categoryregistrations:")
  for (const idx of indexes) {
    console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}${idx.unique ? " [unique]" : ""}`)
  }
  console.log("")
}

async function swapIndexes(CategoryRegistration, dryRun) {
  console.log("🔧 Index migration...")

  const indexes = await CategoryRegistration.collection.indexes()
  const indexNames = indexes.map((i) => i.name)

  if (indexNames.includes(NEW_UNIQUE_INDEX) && !indexNames.includes(LEGACY_UNIQUE_INDEX)) {
    console.log("   ✓ Index migration already complete.")
    await listIndexes(CategoryRegistration)
    return
  }

  const legacyRemaining = await CategoryRegistration.countDocuments(legacyFilter())
  if (legacyRemaining > 0) {
    throw new Error(
      `${legacyRemaining} registration(s) still lack seasonId. Run --backfill before --swap-indexes.`
    )
  }

  if (dryRun) {
    console.log("   [dry-run] Would:")
    console.log(`     1. Drop legacy index: ${LEGACY_UNIQUE_INDEX}`)
    console.log("     2. Create uniq_user_season_category (unique)")
    console.log("     3. Create user_history_by_season")
    console.log("     4. Create season_admin_report")
    return
  }

  if (indexNames.includes(LEGACY_UNIQUE_INDEX)) {
    console.log(`   Dropping legacy index: ${LEGACY_UNIQUE_INDEX}`)
    await CategoryRegistration.collection.dropIndex(LEGACY_UNIQUE_INDEX)
  } else {
    console.log(`   Legacy index ${LEGACY_UNIQUE_INDEX} not found — skipping drop`)
  }

  console.log("   Creating season-aware indexes...")
  await CategoryRegistration.collection.createIndex(
    { clerkUserId: 1, seasonId: 1, category: 1 },
    { unique: true, name: NEW_UNIQUE_INDEX }
  )
  await CategoryRegistration.collection.createIndex(
    { clerkUserId: 1, seasonYear: -1, registeredAt: -1 },
    { name: "user_history_by_season" }
  )
  await CategoryRegistration.collection.createIndex(
    { seasonId: 1, paymentStatus: 1, category: 1 },
    { name: "season_admin_report" }
  )

  console.log("   ✓ Index migration complete")
  await listIndexes(CategoryRegistration)
}

async function main() {
  const args = parseArgs(process.argv)

  if (args.help) {
    printHelp()
    process.exit(0)
  }

  const hasAction =
    args.dryRun || args.seedSeasons || args.backfill || args.verify || args.swapIndexes

  if (!hasAction) {
    printHelp()
    process.exit(1)
  }

  loadEnvLocal()
  await connect()

  const { Season, CategoryRegistration } = await getModels()

  try {
    await reportCounts(CategoryRegistration, Season)

    if (args.dryRun && !args.seedSeasons && !args.backfill && !args.verify && !args.swapIndexes) {
      console.log("Dry run complete. No changes made.")
      return
    }

    let season2025 = await Season.findOne({ slug: SEASON_2025.slug })

    if (args.seedSeasons) {
      const seeded = await seedSeasons(Season, args.dryRun)
      season2025 = seeded.season2025 || season2025
    }

    if (args.backfill) {
      if (!season2025 && !args.dryRun) {
        const seeded = await seedSeasons(Season, false)
        season2025 = seeded.season2025
      }
      await backfillRegistrations(CategoryRegistration, season2025, args.dryRun)
    }

    if (args.verify && !args.dryRun) {
      await verify(CategoryRegistration)
    }

    if (args.swapIndexes) {
      await swapIndexes(CategoryRegistration, args.dryRun)
    }

    if (!args.dryRun) {
      await reportCounts(CategoryRegistration, Season)
    }

    console.log("✅ Done")
  } finally {
    await mongoose.disconnect()
  }
}

main().catch((err) => {
  console.error("\n❌ Migration failed:", err.message)
  process.exit(1)
})
