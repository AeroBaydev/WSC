import { NextResponse } from "next/server"
import { z } from "zod"
import dbConnect from "@/lib/dbConnect"
import User from "@/lib/userModel"
import { currentUser } from "@clerk/nextjs/server"

const SaveUserSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  username: z.string().trim().min(2).max(50),
  schoolName: z.string().trim().min(1).max(200),
})

export async function POST(req) {
  await dbConnect()
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = SaveUserSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile data" }, { status: 400 })
  }

  const { firstName, lastName, username, schoolName } = parsed.data
  const email = clerkUser.primaryEmailAddress?.emailAddress

  try {
    const existingUser = await User.findOne({ userId: clerkUser.id })

    if (existingUser) {
      return NextResponse.json({ success: true, user: existingUser, alreadyExists: true })
    }

    const user = await User.create({
      userId: clerkUser.id,
      firstName,
      lastName,
      username,
      schoolName,
      email,
    })
    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("[save-user] error:", error?.message || error)
    return NextResponse.json({ error: "Failed to save profile" }, { status: 400 })
  }
}

export async function GET() {
  await dbConnect()
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await User.findOne({ userId: clerkUser.id })
    return NextResponse.json({ exists: !!user, user })
  } catch (error) {
    console.error("[save-user] check error:", error?.message || error)
    return NextResponse.json({ error: "Failed to check profile" }, { status: 400 })
  }
}
