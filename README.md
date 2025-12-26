# 🚀 World Skill Challenge 2025

A modern, production-ready website for the World Skill Challenge – Crafting Champions of Tomorrow. Built with Next.js App Router, Clerk authentication, MongoDB, Tailwind CSS, and Framer Motion. Includes complete Zoho Forms integration for category-based registrations with webhook processing and duplicate prevention.

**🌐 Live Site**: [https://worldskillchallenge.com](https://worldskillchallenge.com)

## 🌟 Highlights

- **4 Competition Categories**: IDEA IGNITE, MYSTERY MAKERS, TECH FOR GOOD, TECH THROTTLE
- **Secure Auth**: Clerk-powered sign in/sign up
- **Data Layer**: MongoDB (Mongoose) with connection pooling
- **Forms**: Zoho Forms with hidden fields, signature verification, and webhook ingestion
- **UI/UX**: Tailwind CSS, Framer Motion, responsive, accessible, polished
- **DX**: TypeScript-ready, App Router, API Routes, component library

## 🧭 Table of Contents

- Features
- Tech Stack
- Project Structure
- Environment Variables
- Getting Started
- Zoho Forms Integration
- Available Scripts
- Deployment
- Support

## ✨ Features

- **Competition Catalog** with pricing, features, and dynamic registration links
- **Clerk Authentication** via `@clerk/nextjs`
- **Registration Flow**
  - Prefills Zoho forms with Clerk user data
  - Webhook verifies signature and persists to MongoDB
  - Prevents duplicate registrations per category (server + UI)
  - Redirects to success page and confirms registration
- **Strict Exam-Grade Quiz System**
  - 30 multiple-choice questions, 30-minute time limit
  - Mandatory registration before quiz access
  - Server-controlled timer (no client manipulation)
  - Fullscreen enforcement with auto-submit on exit
  - Tab/browser switch detection
  - Heartbeat system (5-second intervals, 10-second timeout)
  - One attempt per user, permanent session lock after submission
  - Anti-cheating measures: disabled right-click, copy/paste, keyboard shortcuts
- **Content Pages**: Home, FAQ, Updates, Contact
- **SEO**: `robots.js`, `sitemap.js`, `SEOHead` component

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router), React 18
- **Auth**: Clerk
- **Database**: MongoDB (Mongoose)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI based components (shadcn style)
- **Deploy**: Vercel

## 📁 Project Structure

```
WSC/
├── app/
│  ├── api/
│  │  ├── contact/route.js
│  │  ├── register/route.js
│  │  ├── save-user/route.js
│  │  ├── mark-registered/route.ts
│  │  ├── webhook/zoho-success/route.ts
│  │  └── quiz/
│  │     ├── register/route.js
│  │     ├── questions/route.js
│  │     ├── heartbeat/route.js
│  │     └── submit/route.js
│  ├── components/
│  │  ├── About.js
│  │  ├── Categories.js
│  │  ├── Contact.js
│  │  ├── CursorFollower.js
│  │  ├── FAQ.js
│  │  ├── Footer.js
│  │  ├── Hero.js
│  │  ├── Navbar.js
│  │  ├── Register.jsx
│  │  ├── RegistrationSuccess.js
│  │  ├── SEOHead.js
│  │  ├── Stages.js
│  │  └── Updates.js
│  ├── faq/page.js
│  ├── updates/page.js
│  ├── registration-success/page.tsx
│  └── quiz/
│     ├── register/page.js
│     ├── take/page.js
│     └── success/page.js
│  ├── globals.css
│  ├── layout.js
│  ├── page.js
│  ├── robots.js
│  └── sitemap.js
├── components/
│  ├── theme-provider.tsx
│  └── ui/... (Radix-based UI components)
├── hooks/
│  ├── use-mobile.tsx
│  └── use-toast.ts
├── lib/
│  ├── dbConnect.ts
│  ├── userModel.ts
│  ├── utils.ts
│  ├── quizSessionModel.js
│  ├── quizQuestions.js
│  └── jwtUtils.js
├── middleware.ts
├── public/
│  └── images/* and assets
├── styles/globals.css
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🔐 Environment Variables

Create a `.env.local` in the project root:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
CLERK_WEBHOOK_SECRET=optional_if_used

# Email Configuration (for contact form)
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_email_password
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false

# Zoho Integration
ZOHO_WEBHOOK_SECRET=your_zoho_webhook_secret

# Razorpay Payment Integration
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_razorpay_secret
RAZORPAY_BASE_URL=https://api.razorpay.com/v1
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
RAZORPAY_SUCCESS_REDIRECT_URL=https://worldskillchallenge.com/registration-success
ALREADY_REGISTERED_URL=https://worldskillchallenge.com/registration-success?status=already

# Admin Configuration
ADMIN_SEED_SECRET=your_admin_secret_key

# Optional: Dynamic Coupons
COUPONS_JSON=[{"code":"NEHA20","discountType":"percent","amount":20,"active":true}]

# Quiz System (JWT for session tokens)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

Notes:
- Use **live keys** (`rzp_live_`, `pk_live_`, `sk_live_`) for production
- Use **test keys** (`rzp_test_`, `pk_test_`, `sk_test_`) for development
- `ZOHO_WEBHOOK_SECRET` must match the secret configured in Zoho Webhook settings
- `RAZORPAY_WEBHOOK_SECRET` must match the secret configured in Razorpay Dashboard

## 🚀 Getting Started

1. Install dependencies
```bash
npm install
```

2. Set environment variables
- Create `.env.local` with the values shown above

3. Run the dev server
```bash
npm run dev
```

4. Open the app
- `http://localhost:3000`

## 🎯 Quiz System

The quiz system is a strict, exam-grade assessment with comprehensive anti-cheating measures.

### Quiz Flow

1. **Registration** (`/quiz/register`)
   - User must provide: Full Name, Email, Mentor Name, School Name
   - Email must be unique (one attempt per email)
   - Creates quiz session with server-controlled timer
   - Generates JWT session token

2. **Quiz Taking** (`/quiz/take`)
   - 30 multiple-choice questions, shuffled order
   - Options shuffled per question
   - 30-minute time limit (server-controlled)
   - One question per screen
   - Timer display (synced with server)

3. **Anti-Cheating Measures**
   - **Fullscreen Enforcement**: Auto-submits if fullscreen is exited
   - **Tab Detection**: Auto-submits if user switches tabs or minimizes browser
   - **Heartbeat System**: Client sends heartbeat every 5 seconds; server auto-submits if heartbeat stops for 10+ seconds
   - **Disabled Actions**: Right-click, copy, cut, paste, keyboard shortcuts (Ctrl+C, Ctrl+V, etc.)
   - **Back Button**: Prevented and triggers auto-submit
   - **Page Refresh/Close**: Auto-submits on attempt

4. **Submission** (`/quiz/submit`)
   - Server calculates score (client never sees correct answers)
   - Session locked permanently after submission
   - No retry allowed

5. **Success Page** (`/quiz/success`)
   - Shows confirmation message only
   - No score or answers displayed

### API Endpoints

- `POST /api/quiz/register` - Register and start quiz session
- `GET /api/quiz/questions` - Fetch shuffled questions (requires JWT)
- `POST /api/quiz/heartbeat` - Update heartbeat (called every 5 seconds)
- `POST /api/quiz/submit` - Submit answers and calculate score

### Environment Variables

- `JWT_SECRET`: Secret key for JWT token generation (required)

### Important Notes

- Timer is **server-controlled** - client timer is for display only
- Questions and options are shuffled per session
- One attempt per email address
- Session statuses: `active`, `submitted`, `auto_submitted`
- Auto-submission triggers: time expired, heartbeat timeout, fullscreen exit, tab switch, page refresh/close

## 🔗 Zoho Forms Integration

This project includes a full Zoho integration: dynamic links, webhook, redirect confirmation, and duplicate prevention.

- Dynamic form links are generated in `app/components/Register.jsx` using Clerk user data:
  - `clerkUserId`, `email`, `category` are appended as query params to Zoho URLs
- Webhook endpoint: `app/api/webhook/zoho-success/route.ts`
  - Verifies `x-zoho-signature` with `ZOHO_WEBHOOK_SECRET`
  - Extracts `clerkUserId`, `email`, `category`, `Payment_Status`
  - Adds category to the user's `categories` array if not already present
- Registration confirmation: `app/registration-success/page.tsx`
  - Reads `clerkUserId` and `category` from query
  - Calls `POST /api/mark-registered` to confirm
- Duplicate prevention:
  - Server: both webhook and `mark-registered` prevent duplicates
  - UI: registered categories show a disabled "Already Registered" state

Update your Zoho form base URLs in `Register.jsx`:
```js
const categoryFormBaseUrls = {
  "IDEA IGNITE": "yourlink",
  "MYSTERY MAKERS": "yourlink",
  "TECH FOR GOOD": "yorlink",
  "TECH THROTTLE": "yourlink",
}
```

Configure Zoho:
- Webhook URL: `https://worldskillchallenge.com/api/webhook/zoho-success`
- Redirect URL: `https://worldskillchallenge.com/registration-success?clerkUserId=${clerkUserId}&category=${category}`
- Hidden fields: `clerkUserId`, `email`, `category` (aliases must match exactly)

## 🧪 Available Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Lint
```

## 📦 Data Model

`lib/userModel.ts`
- `userId` (Clerk ID), `firstName`, `lastName`, `username`, `schoolName`
- `categories`: array of `{ category: string, paymentStatus: string, registeredAt: Date }`

`lib/quizSessionModel.js`
- `email`, `fullName`, `mentorName`, `schoolName`
- `sessionToken` (JWT), `startTime`, `endTime`, `lastHeartbeat`
- `status`: 'active' | 'submitted' | 'auto_submitted'
- `answers`: array of `{ questionId, selectedOption, answeredAt }`
- `questionOrder`, `optionMappings` (for shuffled questions)
- `score`, `submittedAt`, `violationReasons`

## ☁️ Deployment (Vercel)

1. Push to GitHub
2. Import repo in Vercel
3. Add env vars (same as `.env.local`)
4. Deploy

## 🛠 Troubleshooting & Issues Resolved

### Issues Encountered During Development

#### 1. **Zoho Webhook Failures (500 Internal Server Error)**
**Problem**: Webhook returning 500 errors due to undefined variables
**Solution**: 
- Fixed undefined `paymentStatus` and `paymentAmount` variables in webhook code
- Added proper error handling and logging
- Ensured all required environment variables are set

#### 2. **Payment Page Not Opening (zoho-redirect endpoint failures)**
**Problem**: Users couldn't access Razorpay payment page
**Root Causes & Solutions**:
- **Missing Environment Variables**: Added all required Razorpay credentials
- **URL Parsing Errors**: Fixed `RAZORPAY_BASE_URL` configuration issues
- **Vercel Free Tier Limitations**: Added 8-second timeout and optimized for free tier
- **Success URL Parsing**: Simplified URL construction to avoid parsing errors

#### 3. **Environment Variable Configuration Issues**
**Problem**: Incorrect or missing environment variables in Vercel
**Solution**:
- Created comprehensive environment variable documentation
- Added validation checks for critical variables
- Implemented fallback values and better error messages

#### 4. **Database Connection Issues**
**Problem**: MongoDB connection failures
**Solution**:
- Fixed connection string format
- Added proper error handling for database operations
- Implemented connection pooling

#### 5. **Payment Flow Optimization for Vercel Free Tier**
**Problem**: Function timeouts on free Vercel plan
**Solution**:
- Added 8-second timeout (under 10-second limit)
- Optimized API calls and reduced processing time
- Implemented efficient error handling

### Key Fixes Applied

1. **Hardcoded Correct URLs**: Removed dependency on potentially malformed environment variables
2. **Simplified URL Construction**: Used direct string concatenation instead of complex URL parsing
3. **Added Comprehensive Error Handling**: Better error messages for debugging
4. **Optimized for Free Tier**: Ensured compatibility with Vercel free plan limitations
5. **Fixed Webhook Code**: Resolved undefined variable issues

### Payment Data Storage Issue

**Current Issue**: System stores user data even for incomplete payments
**Recommended Solution**: Modify the flow to only store data after successful payment

To implement this, you would need to:
1. Remove user data creation from `zoho-redirect` endpoint
2. Only create user records in the Razorpay webhook when `paymentStatus: 'success'`
3. Use temporary session storage for incomplete registrations

## 📞 Support

- **Email**: worldskillchallenge@gmail.com
- **Phone**: +91 9266300825
- **Website**: [https://worldskillchallenge.com](https://worldskillchallenge.com)

---

Made with ❤️ to empower young innovators❤️.
