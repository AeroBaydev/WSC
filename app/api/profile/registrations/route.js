import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import dbConnect from "@/lib/dbConnect.js"
import {
  getRegistrationHistory,
  groupRegistrationsBySeason,
} from "@/lib/registrationService.js"
import { formatSeasonSummary, getActiveSeasonOptional } from "@/lib/seasonService.js"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const activeSeason = await getActiveSeasonOptional()
    const rows = await getRegistrationHistory(userId)
    const history = groupRegistrationsBySeason(rows, activeSeason)

    return NextResponse.json({
      success: true,
      activeSeason: formatSeasonSummary(activeSeason),
      history,
      totalRegistrations: rows.length,
    })
  } catch (error) {
    console.error("profile/registrations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
