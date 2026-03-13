## 🚀 World Skill Challenge 2025

A modern, production-ready website for the World Skill Challenge – Crafting Champions of Tomorrow.  
Built with Next.js App Router, Clerk authentication, MongoDB, Tailwind CSS, Framer Motion, **custom in‑app registration forms**, Razorpay Payment Links, and optional Zoho Sheet syncing for reporting.

**🌐 Live Site**: `https://worldskillchallenge.com`

---

## 🌟 Highlights

- **Multiple Competitions** under **ExperienceX** (STEAM/Robotics/Gaming) and **SoarFest** (Aeromodelling)
- **Secure Auth**: Clerk-powered sign in/sign up
- **Custom Forms**: In‑app registration forms (no Zoho Forms) with validation and terms capture
- **Payments**: Razorpay Payment Links with coupon support and webhook-based confirmation
- **Data Layer**: MongoDB (Mongoose) with connection pooling
- **Reporting**: Optional push of successful registrations to a Zoho Sheet
- **UI/UX**: Tailwind CSS, Framer Motion, responsive, accessible, polished
- **DX**: App Router, API Routes, shared component library

---

## 🧭 Table of Contents

- Features
- Tech Stack
- Project Structure
- Environment Variables
- Getting Started
- Registration & Payment Flow (Custom Forms)
- Coupons
- Webhooks & External Integrations
- Available Scripts
- Data Model
- Deployment
- Troubleshooting & Notes
- Support

---

## ✨ Features

- **Competition Catalog & Pricing**
  - Rich cards for all ExperienceX and SoarFest categories
  - Per‑category pricing and prize highlights
- **Clerk Authentication**
  - `@clerk/nextjs` based auth, used across registration flows
- **Profile + Category Registration**
  - Step 1: User completes a **profile** in `app/components/Register.jsx` (first name, last name, username, school)
  - Step 2: User selects a **competition category**
  - Step 3: User is taken to an **internal registration form** at `/register/form`
- **Custom In‑App Forms (No Zoho Forms)**
  - Full team details, parent/mentor contacts, age category + class validation
  - Required Terms & Conditions consent stored in MongoDB
- **Payment Integration (Razorpay)**
  - Server-side creation of **Razorpay Payment Links** per category
  - Coupon support via `lib/coupons-config.js` + `lib/coupon.js`
  - Webhook updates payment status and finalizes registration
- **Registration Status & Duplicate Prevention**
  - `CategoryRegistration` model enforces one successful registration per user per category
  - Frontend clearly shows “Registered / Pending / Failed / Not Registered” per category
- **Content & SEO**
  - Static pages: Home, About, ExperienceX, SoarFest, FAQ, Updates, Contact
  - SEO helpers via `robots.js`, `sitemap.js`, and `SEOHead` component

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router), React 18
- **Auth**: Clerk
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix-based components (shadcn-style) in `components/ui`
- **Payments**: Razorpay Payment Links + Webhooks
- **Integrations (optional)**: Zoho Sheet sync via API
- **Deploy**: Vercel

---

## 📁 Project Structure

High-level structure (only key paths shown):

```txt
WSC/
├── app/
│  ├── api/
│  │  ├── contact/route.js                     # Contact form email handler
│  │  ├── save-user/route.js                   # Create/update user profile
│  │  ├── check-category-registration/route.js # List user's category registrations
│  │  ├── registration/
│  │  │  ├── initiate/route.js                 # Create Razorpay payment link + save form
│  │  │  └── status/route.js                   # Fetch registration/payment status for a category
│  │  ├── razorpay-webhook/route.js            # Razorpay webhook (payment.captured/payment_link.paid)
│  │  ├── webhook/zoho-success/route.js        # Legacy Zoho Forms webhook (optional)
│  │  └── mark-registered/route.js             # Legacy endpoint (used by older flow)
│  ├── components/
│  │  ├── About.js
│  │  ├── Contact.js
│  │  ├── ExperienceX.js
│  │  ├── SoarFest.js
│  │  ├── FAQ.js
│  │  ├── Footer.js
│  │  ├── Hero.js
│  │  ├── Navbar.js
│  │  ├── Register.jsx                         # Profile + category cards + status
│  │  ├── RegistrationSuccess.js
│  │  ├── RegionalLocations.js
│  │  ├── StatsCounter.js
│  │  ├── Updates.js
│  │  └── SEOHead.js
│  ├── register/page.js                        # Mounts Register component
│  ├── register/form/page.js                   # Custom in-app registration form
│  ├── registration-success/page.js            # Post‑payment success page
│  ├── faq/page.js
│  ├── contact/page.js
│  ├── updates/page.js
│  ├── experiencex/page.js
│  ├── soarfest/page.js
│  ├── about/page.js
│  ├── layout.js
│  ├── page.js
│  ├── robots.js
│  └── sitemap.js
├── components/
│  ├── theme-provider.tsx
│  └── ui/…                                    # shadcn/Radix-based UI primitives
├── hooks/
│  ├── use-mobile.tsx
│  └── use-toast.ts
├── lib/
│  ├── dbConnect.js
│  ├── userModel.js
│  ├── categoryRegistrationModel.js
│  ├── pricing.js                              # Category prices
│  ├── coupon.js                               # Coupon pricing logic
│  ├── coupons-config.js                       # Coupon definitions (or COUPONS_JSON)
│  ├── zohoSheetSync.js                        # Optional Zoho Sheet integration
│  └── utils.js
├── middleware.ts
├── public/
│  ├── images/…                                # Hero, judges, backgrounds, etc.
│  └── video/…                                 # Marketing videos
├── styles/globals.css
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔐 Environment Variables

Create a `.env.local` in the project root (example keys, replace with your own):

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

# Razorpay Payment Integration
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Optional: override Razorpay API base URL (defaults to https://api.razorpay.com/v1)
RAZORPAY_BASE_URL=https://api.razorpay.com/v1

# Optional: Dynamic coupons override (instead of editing coupons-config.js)
COUPONS_JSON=[{"code":"NEHA20","discountType":"percent","amount":20,"active":true}]

# Optional: Zoho integrations (for sheet sync / legacy forms)
ZOHO_WEBHOOK_SECRET=your_zoho_webhook_secret
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_SHEET_RESOURCE_ID=your_sheet_resource_id
ZOHO_SHEET_WORKSHEET_NAME=wsc2026
```

**Notes**

- Use **live keys** (`rzp_live_`, `pk_live_`, `sk_live_`) for production, **test keys** for local testing.
- `RAZORPAY_WEBHOOK_SECRET` must match the secret configured in the Razorpay Dashboard.
- Zoho variables are **optional** and only needed if you enable Zoho Sheet sync or legacy Zoho Forms.

---

## 🚀 Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set environment variables**

   - Create `.env.local` with the values described above.

3. **Run the dev server**

   ```bash
   npm run dev
   ```

4. **Open the app**

   - `http://localhost:3000`

---

## 🧾 Registration & Payment Flow (Custom Forms)

**1. Profile completion**

- User signs in with Clerk and lands on `/register`.
- `app/components/Register.jsx` shows profile form (`firstName`, `lastName`, `username`, `schoolName`).
- Profile is persisted via `POST /api/save-user`.

**2. Category selection**

- After profile completion, the same page shows all ExperienceX and SoarFest categories with pricing.
- Each category card links to an **internal form**:  
  `/register/form?category=<CATEGORY_NAME>`

**3. In‑app registration form**

- Implemented in `app/register/form/page.js`.
- Captures:
  - Team name, team size, member names (up to 5)
  - School name
  - Age category (`Primary`, `Junior`, `Senior`) + class; class choices are validated against age category
  - Parent + student contacts
  - Mentor details
  - Coupon code
  - Terms & Conditions acceptance (required)
- On submit, it calls `POST /api/registration/initiate` with `category`, `couponCode`, and `formData`.

**4. Server-side validation & pricing**

- `app/api/registration/initiate/route.js`:
  - Validates payload with `zod` (team size, members, class vs age, etc.).
  - Uses `getBasePriceInPaise` from `lib/pricing.js` based on the category.
  - Applies coupon via `validateAndPriceWithCoupon` in `lib/coupon.js`:
    - Validates code
    - Checks category restrictions and expiry
    - Calculates final price in paise

**5. Creating a Razorpay Payment Link**

- Still inside `registration/initiate`:
  - Upserts a `CategoryRegistration` document for `(clerkUserId, category)`.
  - Stores `formData`, pricing, coupon info and sets `paymentStatus = "initiated"`.
  - Calls Razorpay Payment Link API using basic auth (`RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`).
  - Sets `callback_url` to  
    `/registration-success?clerkUserId=<id>&category=<category>`.
  - Returns `paymentUrl` to the client.

**6. Redirect to payment**

- The client receives `paymentUrl` and does `window.location.href = paymentUrl`.
- User completes payment on Razorpay.

**7. Webhook confirmation**

- Razorpay sends events to `POST /api/razorpay-webhook`.
- `app/api/razorpay-webhook/route.js`:
  - Verifies `x-razorpay-signature` with `RAZORPAY_WEBHOOK_SECRET`.
  - Extracts payment link ID, payment ID, and notes (including `clerkUserId`, `category`, `paymentAmount`, `coupon`).
  - Locates the corresponding `CategoryRegistration` by `paymentLinkId` (preferred) or `(clerkUserId, category)`.
  - On success events (`payment.captured` / `payment_link.paid`):
    - Marks `paymentStatus = "success"`.
    - Fills `transactionId`, `paymentOrderId`, `paymentAmount`, and `registeredAt`.
  - On failure events:
    - Optionally marks existing records as `failed` (but does **not** create new ones).

**8. Registration success page**

- Razorpay redirects the user to `/registration-success?...`.
- `app/registration-success/page.js` renders `RegistrationSuccessContent` and confirms registration.

**9. Status & duplicate prevention**

- `lib/categoryRegistrationModel.js` defines:
  - Unique compound index `{ clerkUserId: 1, category: 1 }` to prevent duplicates.
  - `formData`, coupon fields, payment fields, and Zoho sync status.
- `GET /api/registration/status` returns the latest status for the current user & category.
- `GET /api/check-category-registration` is used by `Register.jsx` to show per‑category chips (Registered, Failed, Not Registered) and disable already registered categories.

---

## 🎟 Coupons

- **Source of truth**: `lib/coupons-config.js`
  - A large list of staff/founder/partner coupon codes.
  - Each coupon defines:
    - `code`
    - `discountType` (`flat` or `percent`)
    - `amount`
    - `active`
    - Optional: `expiresAt`, `allowedCategories`, `maxRedemptions`, etc.
- **Runtime override** (optional):
  - Set `COUPONS_JSON` in the environment to override or extend coupons without redeploying.
  - Can be a JSON array or an object with a `coupons` array.
- **Pricing logic**: `lib/coupon.js`
  - `validateAndPriceWithCoupon({ category, basePricePaise, couponCode })` returns:
    - `finalPricePaise`
    - `applied` (boolean)
    - `reason` (`invalid`, `expired`, `not_allowed_for_category`, `no_code`, etc.)

---

## 🌐 Webhooks & External Integrations

- **Razorpay Webhook**
  - Endpoint: `POST /api/razorpay-webhook`
  - Events handled: `payment.captured`, `payment_link.paid`, `payment.failed`, `payment_link.cancelled`
  - Only **successful** payments result in final `success` registrations.

- **Zoho Sheet Sync (optional)**
  - Handled via `lib/zohoSheetSync.js`, called from the Razorpay webhook.
  - On `payment_link.paid` and when configured, the registration row is pushed to a Zoho Sheet.
  - Uses `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `ZOHO_SHEET_RESOURCE_ID`, `ZOHO_SHEET_WORKSHEET_NAME`.

- **Legacy Zoho Forms (optional / legacy)**
  - Old Zoho Forms flow is retained only for backward compatibility:
    - `app/api/webhook/zoho-success/route.js`
  - For current deployments, the **primary registration method is the custom in‑app form + Razorpay**.
  - For deeper Zoho specifics, see `ZOHO_INTEGRATION.md`.

---

## 🧪 Available Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

---

## 📦 Data Model

- **`lib/userModel.js`**
  - `userId` (Clerk ID, unique)
  - `firstName`, `lastName`, `username`, `schoolName`
  - `email` (unique)
  - `categories`: array of `{ category, paymentStatus, registeredAt, transactionId, paymentAmount }`

- **`lib/categoryRegistrationModel.js`**
  - `clerkUserId`, `email`, `category`
  - `paymentStatus` (`initiated`, `success`, `failed`, etc.)
  - `formData` (team + contact + consent data)
  - `couponCode`, `basePricePaise`, `finalPricePaise`, `discountApplied`, `discountReason`
  - `paymentAmount`, `transactionId`, `paymentLinkId`, `paymentOrderId`, `registeredAt`
  - `zohoFormData` (legacy)
  - `zohoSheetSyncedAt`, `zohoSheetLastError`
  - Unique index on `{ clerkUserId, category }` to prevent duplicate registrations.

---

## ☁️ Deployment (Vercel)

1. Push the repository to GitHub (or GitLab/Bitbucket).
2. Import the repo into Vercel.
3. Configure all required environment variables in the Vercel dashboard.
4. Deploy – Vercel will build and host the Next.js app.

---

## 🛠 Troubleshooting & Notes

- **MongoDB connection issues**
  - Ensure `MONGODB_URI` is set correctly and IP whitelisting / network access is configured.
  - `lib/dbConnect.js` uses a global cached connection; logs “✅ MongoDB Connected” when successful.

- **Razorpay payment link failures**
  - Verify `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`.
  - Check the Vercel logs for `registration/initiate` and `razorpay-webhook` endpoints.
  - On free Vercel tiers, avoid very long‑running operations; payment link creation is already bounded with a timeout.

- **Coupon not applying**
  - Confirm the code exists in `lib/coupons-config.js` (or `COUPONS_JSON`) and `active !== false`.
  - Check `allowedCategories` and `expiresAt` if used.

- **Zoho Sheet sync problems**
  - Ensure all Zoho env vars are set and valid.
  - Check `zohoSheetLastError` field on `CategoryRegistration` documents for error messages.

---

## 📞 Support

- **Email**: `worldskillchallenge@gmail.com`
- **Phone**: `+91 9266300825`
- **Website**: `https://worldskillchallenge.com`

---

Made with ❤️ to empower young innovators.