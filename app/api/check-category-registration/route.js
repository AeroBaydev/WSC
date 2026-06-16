import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import dbConnect from "@/lib/dbConnect.js"
import {
  getCurrentSeasonRegistrations,
  getRegistrationHistory,
} from "@/lib/registrationService.js"
import { formatSeasonSummary, getActiveSeasonOptional } from "@/lib/seasonService.js"

export const dynamic = "force-dynamic"

export async function GET(request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const scope = searchParams.get("scope")

    if (scope === "all") {
      const history = await getRegistrationHistory(userId)
      const activeSeason = await getActiveSeasonOptional()
      return NextResponse.json({
        success: true,
        activeSeason: formatSeasonSummary(activeSeason),
        registrations: history,
      })
    }

    const { season, registrations } = await getCurrentSeasonRegistrations(userId)

    return NextResponse.json({
      success: true,
      activeSeason: formatSeasonSummary(season),
      registrations: registrations || [],
    })
  } catch (error) {
    console.error("Check category registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
