"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { motion } from "framer-motion"

function statusChip(isPaid, paymentStatus) {
  if (isPaid) {
    return {
      label: "Registered",
      className: "bg-green-50 text-green-700 border-green-200",
    }
  }
  const status = String(paymentStatus || "").toLowerCase()
  if (status === "failed" || status === "cancelled") {
    return {
      label: "Payment Failed",
      className: "bg-red-50 text-red-700 border-red-200",
    }
  }
  if (status === "initiated" || status === "pending") {
    return {
      label: "Payment Pending",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    }
  }
  return {
    label: paymentStatus || "Unknown",
    className: "bg-gray-50 text-gray-700 border-gray-200",
  }
}

function formatDate(value) {
  if (!value) return "—"
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return "—"
  }
}

export default function RegistrationHistory() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [history, setHistory] = useState([])
  const [activeSeason, setActiveSeason] = useState(null)

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/profile/registrations")
        const data = await res.json()
        if (!res.ok) {
          setError(data?.error || "Failed to load registration history")
          return
        }
        setHistory(data.history || [])
        setActiveSeason(data.activeSeason || null)
      } catch {
        setError("Failed to load registration history")
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Loading your registration history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">
        {error}
      </div>
    )
  }

  if (!history.length) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No registrations yet</h2>
        <p className="text-gray-600 mb-6">
          You have not registered for any competition categories yet.
        </p>
        <Link
          href="/register"
          className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-6 py-3 rounded-lg"
        >
          Browse Categories
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {activeSeason && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-orange-800 text-sm">
            Current registration season:{" "}
            <span className="font-semibold">{activeSeason.name}</span>
          </p>
        </div>
      )}

      {history.map((seasonGroup) => (
        <motion.section
          key={seasonGroup.seasonYear}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{seasonGroup.seasonName}</h2>
              <p className="text-sm text-gray-500">Season {seasonGroup.seasonYear}</p>
            </div>
            {seasonGroup.isActive ? (
              <span className="text-xs font-semibold uppercase tracking-wide bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                Current Season
              </span>
            ) : (
              <span className="text-xs font-semibold uppercase tracking-wide bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                Past Season
              </span>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {seasonGroup.registrations.map((reg, index) => {
              const chip = statusChip(reg.isPaid, reg.paymentStatus)
              return (
                <div key={`${reg.category}-${index}`} className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{reg.category}</h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {reg.eventType === "soarfest" ? "SoarFest" : "ExperienceX"}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${chip.className}`}>
                      {chip.label}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Registered on</p>
                      <p className="font-medium text-gray-900">{formatDate(reg.registeredAt)}</p>
                    </div>
                    {reg.teamName && (
                      <div>
                        <p className="text-gray-500">Team</p>
                        <p className="font-medium text-gray-900">{reg.teamName}</p>
                      </div>
                    )}
                    {reg.members?.length > 0 && (
                      <div>
                        <p className="text-gray-500">Members</p>
                        <p className="font-medium text-gray-900">{reg.members.filter(Boolean).join(", ")}</p>
                      </div>
                    )}
                    {reg.schoolName && (
                      <div>
                        <p className="text-gray-500">School</p>
                        <p className="font-medium text-gray-900">{reg.schoolName}</p>
                      </div>
                    )}
                    {reg.ageCategory && (
                      <div>
                        <p className="text-gray-500">Age category</p>
                        <p className="font-medium text-gray-900">
                          {reg.ageCategory}
                          {reg.classStd ? ` (Class ${reg.classStd})` : ""}
                        </p>
                      </div>
                    )}
                    {reg.transactionId && (
                      <div>
                        <p className="text-gray-500">Transaction ID</p>
                        <p className="font-medium text-gray-900 break-all">{reg.transactionId}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.section>
      ))}

      <div className="text-center">
        <Link href="/register" className="text-orange-700 font-semibold hover:text-orange-800 underline">
          Register for another category
        </Link>
      </div>
    </div>
  )
}
