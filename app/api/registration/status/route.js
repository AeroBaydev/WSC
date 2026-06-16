import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import dbConnect from "@/lib/dbConnect"
import CategoryRegistration from "@/lib/categoryRegistrationModel"
import { getActiveSeasonOptional, formatSeasonSummary } from "@/lib/seasonService"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    if (!category) return NextResponse.json({ error: "Missing category" }, { status: 400 })

    await dbConnect()

    const activeSeason = await getActiveSeasonOptional()
    if (!activeSeason) {
      return NextResponse.json({ ok: true, found: false, activeSeason: null })
    }

    const reg = await CategoryRegistration.findOne({
      clerkUserId: userId,
      seasonId: activeSeason._id,
      category,
    }).select(
      "paymentStatus paymentLinkId paymentOrderId transactionId category registeredAt finalPricePaise basePricePaise couponCode seasonYear seasonName"
    )

    if (!reg) {
      return NextResponse.json({
        ok: true,
        found: false,
        activeSeason: formatSeasonSummary(activeSeason),
      })
    }

    return NextResponse.json({
      ok: true,
      found: true,
      activeSeason: formatSeasonSummary(activeSeason),
      registration: {
        category: reg.category,
        paymentStatus: reg.paymentStatus,
        registeredAt: reg.registeredAt,
        paymentLinkId: reg.paymentLinkId,
        paymentOrderId: reg.paymentOrderId,
        transactionId: reg.transactionId,
        basePricePaise: reg.basePricePaise,
        finalPricePaise: reg.finalPricePaise,
        couponCode: reg.couponCode,
        seasonYear: reg.seasonYear,
        seasonName: reg.seasonName,
      },
    })
  } catch (err) {
    console.error("registration/status error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
