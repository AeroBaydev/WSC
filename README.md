# World Skill Challenge

A production-ready website for the **World Skill Challenge** — a national competition platform for young innovators in STEAM, robotics, gaming, and aeromodelling.

Built with **Next.js 14 App Router**, **Clerk** authentication, **MongoDB/Mongoose**, **Tailwind CSS**, **Framer Motion**, custom in-app registration forms, **Razorpay Payment Links**, and optional **Zoho Sheet** syncing.

**Live site:** [https://worldskillchallenge.com](https://worldskillchallenge.com)

---

## Highlights

- **Two competition programs:** **ExperienceX** (STEAM / Robotics / Gaming) and **SoarFest** (Aeromodelling)
- **Multi-season registration:** Students can register again each season; duplicate prevention is per season + category
- **Clerk authentication:** Sign in / sign up across registration and profile flows
- **Custom in-app forms:** Team details, contacts, age/class validation, terms consent — no Zoho Forms required
- **Razorpay payments:** Payment Links, webhooks, coupon support, idempotent redemption tracking
- **Registration history:** `/profile` shows participation across all past seasons
- **MongoDB data layer:** Mongoose models with season-aware indexes and connection pooling
- **Optional reporting:** Push successful registrations to a Zoho Sheet
- **Modern UI:** Tailwind CSS, Framer Motion, responsive layout, Radix/shadcn-style components

---

## Table of Contents

- [Features](#features)
- [Competition Categories](#competition-categories)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Season System](#season-system)
- [Registration & Payment Flow](#registration--payment-flow)
- [API Reference](#api-reference)
- [Coupons](#coupons)
- [Webhooks & Integrations](#webhooks--integrations)
- [Data Models](#data-models)
- [Database Migration (Seasons)](#database-migration-seasons)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Support](#support)

---

## Features

### Competition & content

- Rich category pages for **ExperienceX** and **SoarFest** with descriptions, fees, and team sizes
- Static marketing pages: Home, About, ExperienceX, SoarFest, FAQ, Updates, Contact
- SEO via `robots.js`, `sitemap.js`, and per-page metadata

### Authentication & profile

- Clerk-powered auth (`@clerk/nextjs`) on register, form, and profile pages
- **Step 1:** User completes a profile on `/register` (name, username, school)
- **Step 2:** User selects a category and fills the internal form at `/register/form`
- **My Registrations:** `/profile` shows full history grouped by season

### Season-aware registration

- Each registration is tied to a **Season** (`wsc-2025`, `wsc-2026`, …)
- **One registration per user per category per season** (enforced by DB unique index)
- Users who participated in 2025 can register for the **same category** again in 2026
- Register page shows eligibility for the **active season only**
- Profile page shows **all seasons** (past + current)

### Payments & coupons

- Razorpay Payment Links created server-side per registration
- Webhook confirms payment and marks `paymentStatus = success`
- Coupon codes from `lib/coupons-config.js` (or `COUPONS_JSON` env override)
- Atomic coupon redemption tracking via `lib/couponRedemption.js`

### Registration gate

- Global on/off switch in `lib/registrationConfig.js` (`REGISTRATION_OPEN`)
- Season-level open/close via MongoDB `Season` documents (`status`, `registrationOpensAt`, `registrationClosesAt`)

---

## Competition Categories

### ExperienceX (WSC)

| Category | Fee (INR) |
|----------|-----------|
| STARS & BEYOND | ₹499 |
| IDEA TANK | ₹665 |
| ESPORTS SHOWDOWN | ₹2,499 |
| MYSTERY MAKERS | ₹2,499 |
| TECH FOR GOOD | ₹3,332 |
| TECH THROTTLE → RC CAR | ₹5,999 |
| TECH THROTTLE → BATTLEBOT | ₹5,999 |
| TECH THROTTLE → BATTLEBOT: FOOTBALL EDITION | ₹5,999 |

### SoarFest

| Category | Fee (INR) |
|----------|-----------|
| Wing-shot Championship | ₹2,499 |
| RocketMania | ₹2,499 |
| DroneX Kids | ₹2,499 |
| Wing Warriors | ₹4,165 |
| Throttle Titans | ₹4,165 |
| DroneX | ₹5,999 |

Prices are defined in `lib/pricing.js`. Category display names must match exactly between UI, pricing, and API payloads.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router), React 18 |
| Auth | Clerk |
| Database | MongoDB + Mongoose 8 |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| UI primitives | Radix UI / shadcn-style (`components/ui`) |
| Validation | Zod (API routes) |
| Payments | Razorpay Payment Links + Webhooks |
| Rate limiting | Upstash Redis (optional) |
| Deploy | Vercel |

---

## Project Structure

```txt
WSC/
├── app/
│   ├── api/
│   │   ├── check-category-registration/route.js  # Current-season registrations + activeSeason
│   │   ├── contact/route.js                    # Contact form email
│   │   ├── mark-registered/route.js            # Legacy endpoint (User.categories)
│   │   ├── profile/registrations/route.js      # Full registration history by season
│   │   ├── razorpay-webhook/route.js           # Payment confirmation (season-aware)
│   │   ├── registration/
│   │   │   ├── initiate/route.js               # Validate, price, create payment link
│   │   │   └── status/route.js                 # Payment status for active season + category
│   │   ├── save-user/route.js                  # Create/update user profile
│   │   ├── webhook/zoho-success/route.js       # Legacy Zoho Forms webhook
│   │   └── zoho-redirect/route.js              # Legacy Zoho redirect helper
│   ├── components/
│   │   ├── Register.jsx                        # Profile + category cards + season status
│   │   ├── RegistrationHistory.jsx             # Profile history UI
│   │   ├── ProfileGate.jsx                     # Clerk sign-in gate for profile
│   │   ├── ExperienceX.js, SoarFest.js         # Category showcase pages
│   │   ├── Hero.js, Navbar.js, Footer.js, …
│   ├── profile/page.js                         # My Registrations (/profile)
│   ├── register/
│   │   ├── page.js                             # Register landing
│   │   └── form/page.js                        # Category registration form
│   ├── registration-success/                   # Post-payment confirmation + polling
│   ├── about/, contact/, experiencex/, soarfest/, faq/, updates/
│   ├── layout.js, page.js, robots.js, sitemap.js
├── components/ui/                              # shadcn/Radix UI primitives
├── lib/
│   ├── dbConnect.js                            # MongoDB connection (cached)
│   ├── seasonModel.js                          # Season collection schema
│   ├── seasonService.js                        # Resolve active season
│   ├── registrationService.js                  # Eligibility, history, create payloads
│   ├── categoryRegistrationModel.js            # Registration documents (season-aware)
│   ├── userModel.js                            # User profile
│   ├── categories.js                           # ExperienceX vs SoarFest category helper
│   ├── pricing.js                              # Per-category prices
│   ├── coupon.js, coupons-config.js            # Coupon validation + definitions
│   ├── couponModel.js, couponRedemption.js     # Redemption persistence
│   ├── registrationConfig.js                   # REGISTRATION_OPEN kill switch
│   ├── rateLimit.js                            # Optional Upstash rate limiting
│   ├── zohoSheetSync.js                        # Optional Zoho Sheet push
│   └── utils.js, secureCompare.js, escapeHtml.js
├── scripts/
│   └── migrate-seasons.mjs                     # Season backfill + index migration
├── middleware.ts                               # Clerk middleware
├── public/images/, public/video/
└── package.json
```

---

## Environment Variables

Create `.env.local` in the project root:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx

# Email (contact form)
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_email_password
SMTP_HOST=smtp.zoho.in
SMTP_PORT=587

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Optional: Razorpay API base URL (default: https://api.razorpay.com/v1)
RAZORPAY_BASE_URL=https://api.razorpay.com/v1

# Optional: force active registration season (default: DB lookup)
ACTIVE_SEASON_SLUG=wsc-2026

# Optional: dynamic coupons (overrides coupons-config.js)
COUPONS_JSON=[{"code":"NEHA20","discountType":"percent","amount":20,"active":true}]

# Optional: coupon redemption cap default
COUPON_DEFAULT_MAX_REDEMPTIONS=50

# Optional: Upstash Redis rate limiting (recommended for production)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Optional: Zoho integrations
ZOHO_WEBHOOK_SECRET=your_zoho_webhook_secret
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_SHEET_RESOURCE_ID=your_sheet_resource_id
ZOHO_SHEET_WORKSHEET_NAME=wsc2026
```

**Notes**

- Use **live** keys (`rzp_live_`, `pk_live_`, `sk_live_`) in production; **test** keys locally.
- `RAZORPAY_WEBHOOK_SECRET` must match the Razorpay Dashboard webhook configuration.
- `ACTIVE_SEASON_SLUG` is optional; by default the app uses the season where `isActiveRegistrationSeason: true` and `status: open`.
- Zoho variables are only needed if sheet sync or legacy Zoho Forms are enabled.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with the variables above

# 3. (First-time / new database only) Run season migration
npm run migrate:seasons:dry-run
npm run migrate:seasons:all
npm run migrate:seasons:swap-indexes

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To open registration locally, set `REGISTRATION_OPEN = true` in `lib/registrationConfig.js`.

---

## Season System

WSC runs annual competition **seasons**. Registration eligibility is scoped to the **active season**; history is stored across all seasons.

### How the active season is resolved

Server-side only (never from the client):

1. `ACTIVE_SEASON_SLUG` env override (if set), else
2. MongoDB `Season` where `isActiveRegistrationSeason: true` and `status: "open"`, then
3. Optional date checks: `registrationOpensAt` / `registrationClosesAt`

Implemented in `lib/seasonService.js`.

### Uniqueness rule

```
One registration per (clerkUserId, seasonId, category)
```

- User registered for **DroneX in 2025** → can register for **DroneX in 2026**
- User registered for **DroneX in 2026** → blocked from registering again in 2026

Enforced by unique index `uniq_user_season_category` on `CategoryRegistration`.

### Season documents (MongoDB `seasons` collection)

| Field | Description |
|-------|-------------|
| `slug` | e.g. `wsc-2025`, `wsc-2026` |
| `name` | Display name |
| `year` | e.g. `2025`, `2026` |
| `status` | `draft` \| `open` \| `closed` \| `archived` |
| `isActiveRegistrationSeason` | Only one should be `true` at a time |
| `registrationOpensAt` / `registrationClosesAt` | Optional date window |

### Starting a new season (e.g. 2027)

1. Insert a new `Season` document (`wsc-2027`, `status: open`)
2. Set `isActiveRegistrationSeason: false` on all other seasons
3. Set `isActiveRegistrationSeason: true` on `wsc-2027`
4. No code changes required for eligibility logic

---

## Registration & Payment Flow

```
Sign in (Clerk)
    ↓
/register — complete profile (POST /api/save-user)
    ↓
Select category → /register/form?category=...
    ↓
Submit form → POST /api/registration/initiate
    ├── Resolve active season (seasonService)
    ├── Check eligibility for (user, season, category)
    ├── Validate form (Zod) + apply coupon
    ├── Upsert CategoryRegistration (seasonId, formData, initiated)
    └── Create Razorpay Payment Link (notes include seasonId)
    ↓
Redirect to Razorpay → user pays
    ↓
Razorpay webhook → POST /api/razorpay-webhook
    ├── Verify signature
    ├── Find registration by paymentLinkId or (user, seasonId, category)
    └── Mark paymentStatus = success
    ↓
/registration-success — polls GET /api/registration/status
    ↓
/register — shows "Registered" for current season only
/profile — shows all seasons including past years
```

### Registration form fields

Captured in `app/register/form/page.js` and stored in `formData`:

- Team name, team size (1–5), member names
- School name
- Age category (`Primary` / `Junior` / `Senior`) + class (validated against age)
- Parent and student contacts
- Mentor name and contact
- Coupon code (optional)
- Terms & Conditions acceptance (required)

### Frontend status display

`Register.jsx` calls `GET /api/check-category-registration` and shows per category:

- **Registered** — `paymentStatus` is success/completed/paid in the **active season**
- **Payment Failed** — failed/cancelled
- **Register Now** — not registered or payment abandoned (initiated/pending allows retry)

Past-season registrations do **not** block new registration; they appear on `/profile`.

---

## API Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/save-user` | GET | Clerk | Check if profile exists |
| `/api/save-user` | POST | Clerk | Create/update user profile |
| `/api/check-category-registration` | GET | Clerk | Current-season registrations + `activeSeason` |
| `/api/check-category-registration?scope=all` | GET | Clerk | All registrations (flat list) |
| `/api/registration/initiate` | POST | Clerk | Start registration + payment link |
| `/api/registration/status?category=` | GET | Clerk | Status for category in **active season** |
| `/api/profile/registrations` | GET | Clerk | History grouped by season |
| `/api/razorpay-webhook` | POST | Signature | Razorpay payment events |
| `/api/webhook/zoho-success` | POST | Secret header | Legacy Zoho Forms sync |
| `/api/contact` | POST | — | Contact form email |

Core business logic lives in `lib/registrationService.js` and `lib/seasonService.js`.

---

## Coupons

- **Definitions:** `lib/coupons-config.js` (staff/founder/partner codes)
- **Override:** `COUPONS_JSON` environment variable
- **Validation:** `lib/coupon.js` → `validateAndPriceWithCoupon({ category, basePricePaise, couponCode })`
- **Redemption:** `lib/couponRedemption.js` atomically increments count after confirmed payment

Each coupon supports:

- `discountType`: `flat` or `percent`
- `amount`, `active`, optional `expiresAt`, `allowedCategories`, `maxRedemptions`

---

## Webhooks & Integrations

### Razorpay (`POST /api/razorpay-webhook`)

- Verifies `x-razorpay-signature` with `RAZORPAY_WEBHOOK_SECRET`
- Handles: `payment.captured`, `payment_link.paid`, `payment.failed`, `payment_link.cancelled`
- Locates registration by `paymentLinkId` first, then `(clerkUserId, seasonId, category)` from payment notes
- On success: sets `paymentStatus = success`, confirms coupon redemption, optionally syncs to Zoho Sheet

Payment link notes include:

```json
{
  "clerkUserId": "...",
  "category": "...",
  "seasonId": "...",
  "seasonYear": "2026",
  "seasonSlug": "wsc-2026",
  "email": "...",
  "coupon": "...",
  "paymentAmount": "...",
  "app": "wsc"
}
```

### Zoho Sheet sync (optional)

- `lib/zohoSheetSync.js` pushes successful registrations on `payment_link.paid`
- Errors stored in `zohoSheetLastError` on the registration document

### Legacy Zoho Forms

- `app/api/webhook/zoho-success/route.js` — backward compatibility only
- Primary flow is custom in-app form + Razorpay
- See `ZOHO_INTEGRATION.md` for legacy setup details

---

## Data Models

### `Season` (`lib/seasonModel.js`)

Annual competition cycle. Controls which season is open for registration.

### `CategoryRegistration` (`lib/categoryRegistrationModel.js`)

Primary source of truth for category registrations.

| Field | Description |
|-------|-------------|
| `clerkUserId`, `email` | Clerk user identity |
| `seasonId`, `seasonYear`, `seasonSlug`, `seasonName` | Season assignment |
| `category`, `eventType` | `experiencex` or `soarfest` |
| `paymentStatus` | `initiated`, `pending`, `success`, `failed`, etc. |
| `formData` | Team, contacts, consent |
| `couponCode`, `basePricePaise`, `finalPricePaise` | Pricing |
| `paymentLinkId`, `transactionId`, `paymentOrderId` | Razorpay refs |
| `zohoSheetSyncedAt`, `zohoSheetLastError` | Optional sync status |

**Indexes:**

- `{ clerkUserId, seasonId, category }` — unique (`uniq_user_season_category`)
- `{ clerkUserId, seasonYear, registeredAt }` — profile history
- `{ seasonId, paymentStatus, category }` — admin/reporting
- `{ paymentLinkId }` — webhook lookup

### `User` (`lib/userModel.js`)

Clerk profile: `userId`, `firstName`, `lastName`, `username`, `schoolName`, `email`.

> **Note:** `User.categories[]` is legacy. Eligibility and history use `CategoryRegistration` only.

### `Coupon` (`lib/couponModel.js`)

Tracks `redeemedCount` and `redeemedRegistrationIds` for coupon usage limits.

---

## Database Migration (Seasons)

If upgrading from the pre-season schema (registrations without `seasonId`), use the migration script.

```bash
# Preview (read-only)
npm run migrate:seasons:dry-run

# Seed wsc-2025 + wsc-2026, backfill existing records as 2025
npm run migrate:seasons:all

# Drop legacy index, create season-aware indexes
npm run migrate:seasons:swap-indexes
```

**What the migration does:**

1. Creates `wsc-2025` (closed) and `wsc-2026` (active) season documents
2. Tags all registrations missing `seasonId` as Season 2025
3. Sets `eventType` from category name
4. Replaces unique index `{ clerkUserId, category }` with `{ clerkUserId, seasonId, category }`

**Always back up MongoDB before running:**

```bash
mongodump --uri="$MONGODB_URI" --out=./backup-pre-season-migration
```

The script is idempotent — safe to re-run after a successful migration.

---

## Available Scripts

```bash
npm run dev                          # Development server
npm run build                        # Production build
npm run start                        # Start production server
npm run lint                         # ESLint

# Season migration (see Database Migration section)
npm run migrate:seasons:dry-run      # Report counts only
npm run migrate:seasons:all          # Seed + backfill + verify
npm run migrate:seasons:swap-indexes # Swap unique indexes
```

---

## Deployment

### Vercel

1. Push to GitHub (`main` branch)
2. Import repo in Vercel
3. Set all environment variables in the Vercel dashboard
4. Deploy

### Post-deploy checklist

- [ ] `MONGODB_URI` points to production database
- [ ] Season migration completed on production DB (if not already done)
- [ ] `wsc-2026` (or current season) has `isActiveRegistrationSeason: true` and `status: open`
- [ ] `REGISTRATION_OPEN = true` in `lib/registrationConfig.js` when ready to accept registrations
- [ ] Razorpay webhook URL set to `https://worldskillchallenge.com/api/razorpay-webhook`
- [ ] `RAZORPAY_WEBHOOK_SECRET` matches Razorpay Dashboard
- [ ] Clerk production keys configured
- [ ] Optional: `UPSTASH_REDIS_REST_*` for rate limiting

### Opening registration for a new season

1. Ensure season document exists and is active in MongoDB
2. Set `REGISTRATION_OPEN = true` in `lib/registrationConfig.js`
3. Commit and deploy

---

## Troubleshooting

### "Already registered" but user should be able to register

- Confirm the user only has a **past season** registration (check `/profile`)
- Verify active season is `wsc-2026` (not 2025) in MongoDB
- Ensure season migration and index swap completed (`uniq_user_season_category` exists)

### Registration page shows closed

- Check `REGISTRATION_OPEN` in `lib/registrationConfig.js`
- Check active `Season` has `status: open` and valid `registrationOpensAt` / `registrationClosesAt`
- Check `ACTIVE_SEASON_SLUG` env var if set

### MongoDB connection issues

- Verify `MONGODB_URI` and IP whitelist (Atlas → Network Access)
- `lib/dbConnect.js` logs `✅ MongoDB Connected` on success

### Razorpay payment link failures

- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- Check Vercel logs for `/api/registration/initiate`
- Payment link creation has a 30s timeout

### Webhook not updating registration

- Confirm webhook secret matches Razorpay Dashboard
- Check payment notes include `seasonId` (new registrations after season upgrade)
- Lookup order: `paymentLinkId` → `(clerkUserId, seasonId, category)`

### Coupon not applying

- Code must exist in `coupons-config.js` or `COUPONS_JSON` with `active !== false`
- Check `allowedCategories` and `expiresAt`
- Check `maxRedemptions` via `lib/couponRedemption.js`

### Zoho Sheet sync

- Ensure all `ZOHO_*` env vars are set
- Inspect `zohoSheetLastError` on the registration document

---

## Support

- **Email:** worldskillchallenge@gmail.com
- **Phone:** +91 9266300825
- **Website:** [https://worldskillchallenge.com](https://worldskillchallenge.com)

---

Made with care to empower young innovators across India.
