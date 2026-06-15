import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { escapeHtml } from "@/lib/escapeHtml.js"
import { checkRateLimit, getClientIp } from "@/lib/rateLimit.js"

let cachedTransporter = null
let transporterVerified = false

function getTransporter() {
  if (cachedTransporter) return cachedTransporter

  const EMAIL_USER = process.env.EMAIL_USER
  const EMAIL_PASS = process.env.EMAIL_PASS
  const SMTP_HOST = process.env.SMTP_HOST || "smtp.zoho.com"
  const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
  const SMTP_SECURE =
    typeof process.env.SMTP_SECURE !== "undefined"
      ? String(process.env.SMTP_SECURE).toLowerCase() === "true"
      : SMTP_PORT === 465

  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    authMethod: "LOGIN",
    requireTLS: !SMTP_SECURE,
    tls: { minVersion: "TLSv1.2" },
    connectionTimeout: 15_000,
    socketTimeout: 20_000,
  })

  return cachedTransporter
}

async function ensureTransporterReady() {
  const transporter = getTransporter()
  if (transporterVerified) return transporter
  await transporter.verify()
  transporterVerified = true
  return transporter
}

export async function POST(request) {
  try {
    const rate = await checkRateLimit(`contact:${getClientIp(request)}`, {
      limit: 5,
      windowSec: 300,
    })
    if (!rate.success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()

    const requiredFields = ["name", "email", "subject", "message"]
    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const EMAIL_USER = process.env.EMAIL_USER
    const EMAIL_PASS = process.env.EMAIL_PASS

    if (!EMAIL_USER || !EMAIL_PASS) {
      return NextResponse.json({ error: "Email service is not configured." }, { status: 500 })
    }

    try {
      await ensureTransporterReady()
    } catch (verifyErr) {
      console.error("[contact] SMTP verify failed:", verifyErr?.message || verifyErr)
      return NextResponse.json({ error: "Email service temporarily unavailable." }, { status: 500 })
    }

    const name = String(body.name).trim().slice(0, 200)
    const email = String(body.email).trim().slice(0, 254)
    const phone = String(body.phone || "").trim().slice(0, 30)
    const subject = String(body.subject).trim().slice(0, 200)
    const message = String(body.message).trim().slice(0, 5000)

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safePhone = escapeHtml(phone || "Not provided")
    const safeSubject = escapeHtml(subject)
    const safeMessage = escapeHtml(message)

    const mailSubject = `[Contact Form] ${subject}`

    const text = `
New contact form submission:

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Subject: ${subject}

Message:
${message}
`.trim()

    const html = `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #111;">
    <h2 style="margin: 0 0 12px;">New contact form submission</h2>
    <p style="margin: 0 0 6px;"><strong>Name:</strong> ${safeName}</p>
    <p style="margin: 0 0 6px;"><strong>Email:</strong> ${safeEmail}</p>
    <p style="margin: 0 0 12px;"><strong>Phone:</strong> ${safePhone}</p>
    <p style="margin: 0 0 6px;"><strong>Subject:</strong> ${safeSubject}</p>
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 12px 0;" />
    <p style="white-space: pre-wrap; margin: 12px 0;">${safeMessage}</p>
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 12px 0;" />
    <p style="font-size: 12px; color: #6b7280;">Sent at ${new Date().toISOString()}</p>
  </div>
`.trim()

    const transporter = getTransporter()
    await transporter.sendMail({
      from: `"World Skill Challenge" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: email,
      subject: mailSubject,
      text,
      html,
    })

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("[contact] error:", error?.message || error)
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 })
  }
}
