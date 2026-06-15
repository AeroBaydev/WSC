import { NextResponse } from "next/server"
import { z } from "zod"
import { auth, currentUser } from "@clerk/nextjs/server"
import dbConnect from "@/lib/dbConnect"
import CategoryRegistration from "@/lib/categoryRegistrationModel"
import User from "@/lib/userModel"
import { getBasePriceInPaise } from "@/lib/pricing"
import { validateAndPriceWithCoupon } from "@/lib/coupon"
import { REGISTRATION_OPEN, REGISTRATION_CLOSED_MESSAGE } from "@/lib/registrationConfig"
import { checkRateLimit, getClientIp } from "@/lib/rateLimit"

export const runtime = "nodejs"
export const preferredRegion = ["bom1"]

const InitiateSchema = z.object({
  category: z.string().min(1),
  couponCode: z.string().optional().default(""),
  formData: z.object({
    teamName: z.string().min(1),
    teamSize: z.number().int().min(1).max(5),
    members: z.array(z.string().min(1)).min(1).max(5),
    schoolName: z.string().min(1),
    ageCategory: z.enum(["Primary", "Junior", "Senior"]),
    classStd: z.string().min(1),
    parentName: z.string().min(1),
    studentContact: z.string().min(7),
    parentContact: z.string().min(7),
    mentorName: z.string().min(1),
    mentorContact: z.string().min(7),
    acceptTerms: z.literal(true),
  }),
})

const allowedClassesByAge = {
  Primary: ["3", "4", "5"],
  Junior: ["6", "7", "8"],
  Senior: ["9", "10", "11", "12"],
}

function getOrigin(request) {
  const origin = request.headers.get("origin")
  if (origin) return origin
  const host = request.headers.get("host")
  if (!host) return "https://worldskillchallenge.com"
  const proto = request.headers.get("x-forwarded-proto") || "https"
  return `${proto}://${host}`
}

export async function POST(request) {
  try {
    if (!REGISTRATION_OPEN) {
      return NextResponse.json({ error: REGISTRATION_CLOSED_MESSAGE }, { status: 403 })
    }

    const rate = await checkRateLimit(`registration-initiate:${getClientIp(request)}`, {
      limit: 10,
      windowSec: 60,
    })
    if (!rate.success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const clerkUser = await currentUser()

    const json = await request.json()
    const parsed = InitiateSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { category, couponCode, formData } = parsed.data

    // Extra guard: members must match team size
    const trimmedMembers = (formData.members || []).slice(0, formData.teamSize).map((m) => m.trim())
    if (trimmedMembers.length !== formData.teamSize || trimmedMembers.some((m) => !m)) {
      return NextResponse.json({ error: "Please enter all team member names." }, { status: 400 })
    }

    const allowed = allowedClassesByAge[formData.ageCategory] || []
    if (!allowed.includes(String(formData.classStd))) {
      return NextResponse.json({ error: "Selected class is not valid for the chosen age category." }, { status: 400 })
    }

    // Price & coupon
    const basePricePaise = getBasePriceInPaise(category)
    const couponResult = await validateAndPriceWithCoupon({
      category,
      basePricePaise,
      couponCode,
    })

    const finalPricePaise = couponResult.finalPricePaise
    const applied = couponResult.applied
    const discountReason = couponResult.reason

    // Upsert "initiated" registration so we can attach paymentLinkId
    await dbConnect()

    const userProfile = await User.findOne({ userId }).select("email schoolName")
    if (!userProfile) {
      return NextResponse.json(
        { error: "Please complete your profile on the Register page before registering for a category." },
        { status: 400 }
      )
    }

    const existing = await CategoryRegistration.findOne({ clerkUserId: userId, category })
    if (existing && existing.paymentStatus === "success") {
      return NextResponse.json({ error: "Already registered in this category." }, { status: 409 })
    }

    const emailFromClerk = clerkUser?.primaryEmailAddress?.emailAddress
    const email = existing?.email || userProfile?.email || emailFromClerk || "unknown@example.com"

    const registration =
      existing ||
      (await CategoryRegistration.create({
        clerkUserId: userId,
        email,
        category,
        paymentStatus: "initiated",
      }))

    registration.paymentStatus = "initiated"
    registration.couponCode = couponCode ? String(couponCode).trim().toUpperCase() : ""
    registration.basePricePaise = basePricePaise
    registration.finalPricePaise = finalPricePaise
    registration.discountApplied = !!applied
    registration.discountReason = discountReason || undefined
    registration.formData = {
      ...formData,
      members: trimmedMembers,
    }

    // Create Razorpay Payment Link via REST API
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    const baseUrl = "https://api.razorpay.com/v1"

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay credentials not configured" }, { status: 500 })
    }

    const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64")

    const origin = getOrigin(request)
    const successUrl = `${origin}/registration-success?clerkUserId=${encodeURIComponent(userId)}&category=${encodeURIComponent(
      category
    )}`

    const payload = {
      amount: finalPricePaise,
      currency: "INR",
      accept_partial: false,
      description: `Registration for ${category}`,
      customer: {
        name: email,
        email,
      },
      notify: { sms: false, email: true },
      reminder_enable: true,
      notes: {
        clerkUserId: userId,
        category,
        email,
        coupon: registration.couponCode || "",
        paymentAmount: String(finalPricePaise),
        app: "wsc",
      },
      callback_url: successUrl,
      callback_method: "get",
    }

    const resp = await fetch(`${baseUrl}/payment_links`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    })

    if (!resp.ok) {
      const errText = await resp.text()
      console.error("Razorpay payment link error:", errText)
      return NextResponse.json({ error: "Failed to create payment link" }, { status: 502 })
    }

    const data = await resp.json()

    registration.paymentLinkId = data?.id || registration.paymentLinkId
    registration.paymentAmount = String(finalPricePaise)
    await registration.save()

    return NextResponse.json({
      ok: true,
      registrationId: String(registration._id),
      paymentUrl: data?.short_url,
      pricing: {
        basePricePaise,
        finalPricePaise,
        couponApplied: !!applied,
        reason: discountReason || null,
      },
    })
  } catch (err) {
    console.error("registration/initiate error:", err)
    if (err?.name === "AbortError") {
      return NextResponse.json({ error: "Payment service timeout - please try again" }, { status: 504 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

