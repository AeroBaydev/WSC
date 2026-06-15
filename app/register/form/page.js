"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs"
import { REGISTRATION_OPEN, REGISTRATION_CLOSED_MESSAGE } from "@/lib/registrationConfig"

const AGE_CATEGORIES = [
  { value: "Primary", label: "Primary (Class 3 to 5)", classes: ["3", "4", "5"] },
  { value: "Junior", label: "Junior (Class 6 to 8)", classes: ["6", "7", "8"] },
  { value: "Senior", label: "Senior (Class 9 to 12)", classes: ["9", "10", "11", "12"] },
]

const TERMS_TEXT =
  "I confirm that I have read and agree to the World Skill Challenge Terms & Conditions. I understand that all submissions must be original and may be used for promotional purposes. I acknowledge that participation fees are non-refundable, the decisions of the judges are final and binding, and all participants are required to adhere to the prescribed safety and conduct guidelines."

function RegisterFormContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category") || ""
  const router = useRouter()

  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress || ""

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [teamSize, setTeamSize] = useState(3)
  const [ageCategory, setAgeCategory] = useState("")

  const allowedClasses = useMemo(() => {
    const ac = AGE_CATEGORIES.find((x) => x.value === ageCategory)
    return ac?.classes || []
  }, [ageCategory])

  const [form, setForm] = useState({
    teamName: "",
    members: ["", "", "", "", ""],
    schoolName: "",
    ageCategory: "",
    classStd: "",
    parentName: "",
    studentContact: "",
    parentContact: "",
    mentorName: "",
    mentorContact: "",
    couponCode: "",
    acceptTerms: false,
  })

  useEffect(() => {
    setForm((f) => ({ ...f, ageCategory }))
  }, [ageCategory])

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }))
  }

  function setMember(idx, value) {
    setForm((f) => {
      const next = [...f.members]
      next[idx] = value
      return { ...f, members: next }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (!category) {
      setError("Missing category. Please go back and choose a category.")
      return
    }
    if (!email) {
      setError("Missing email from your account. Please re-login and try again.")
      return
    }
    if (!form.acceptTerms) {
      setError("Please accept the Terms & Conditions to continue.")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        category,
        couponCode: form.couponCode,
        formData: {
          teamName: form.teamName,
          teamSize,
          members: form.members.slice(0, teamSize),
          schoolName: form.schoolName,
          ageCategory: form.ageCategory,
          classStd: form.classStd,
          parentName: form.parentName,
          studentContact: form.studentContact,
          parentContact: form.parentContact,
          mentorName: form.mentorName,
          mentorContact: form.mentorContact,
          acceptTerms: form.acceptTerms,
        },
      }

      const res = await fetch("/api/registration/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || "Failed to start payment. Please try again.")
        setSubmitting(false)
        return
      }

      // Redirect to Razorpay payment link
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl
        return
      }

      setError("Payment link not returned. Please try again.")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {!REGISTRATION_OPEN ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
            <div className="text-5xl mb-4">⏳</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{REGISTRATION_CLOSED_MESSAGE}</h1>
            <p className="text-gray-600 mb-6">
              Registration is not open yet. Please check back soon to register for your chosen category.
            </p>
            <Link
              href="/register"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold py-3 px-6 transition-all"
            >
              Back to Register
            </Link>
          </div>
        ) : (
          <>
        <SignedOut>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Sign in to Register</h1>
            <p className="text-gray-600 mb-6">Please sign in to fill the registration form.</p>
            <SignInButton mode="modal">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold py-3 px-6 transition-all">
                Sign In
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Category Registration Form</h1>
              <p className="text-gray-600">
                Category: <span className="font-semibold text-gray-900">{category || "—"}</span>
              </p>
              <p className="text-gray-600">
                Logged in as: <span className="font-semibold text-gray-900">{email || "—"}</span>
              </p>
            </div>
            <Link
              href="/register"
              className="text-sm font-semibold text-orange-700 hover:text-orange-800 underline"
            >
              Back to categories
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-800 font-semibold">Step: Fill details → Pay → Registration confirmed</p>
              <p className="text-orange-700 text-sm">
                All fields are mandatory. Your registration will be saved after successful payment.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                  <input
                    value={form.teamName}
                    onChange={(e) => setField("teamName", e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter team name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Members (max 5)</label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                  <input
                    value={form.schoolName}
                    onChange={(e) => setField("schoolName", e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter school name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Category</label>
                  <select
                    value={ageCategory}
                    onChange={(e) => {
                      const next = e.target.value
                      setAgeCategory(next)
                      setField("classStd", "")
                    }}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="" disabled>
                      Select age category
                    </option>
                    {AGE_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={form.classStd}
                    onChange={(e) => setField("classStd", e.target.value)}
                    required
                    disabled={!ageCategory}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="" disabled>
                      {ageCategory ? "Select class" : "Select age category first"}
                    </option>
                    {allowedClasses.map((cl) => (
                      <option key={cl} value={cl}>
                        Class {cl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Team Members Names</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Array.from({ length: teamSize }).map((_, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member {idx + 1} Name
                      </label>
                      <input
                        value={form.members[idx]}
                        onChange={(e) => setMember(idx, e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder={`Enter member ${idx + 1} name`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Parent / Student Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent Name</label>
                    <input
                      value={form.parentName}
                      onChange={(e) => setField("parentName", e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter parent name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student Contact Number</label>
                    <input
                      value={form.studentContact}
                      onChange={(e) => setField("studentContact", e.target.value)}
                      required
                      inputMode="numeric"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter student contact number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent Contact Number</label>
                    <input
                      value={form.parentContact}
                      onChange={(e) => setField("parentContact", e.target.value)}
                      required
                      inputMode="numeric"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter parent contact number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Mentor Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mentor Name</label>
                    <input
                      value={form.mentorName}
                      onChange={(e) => setField("mentorName", e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter mentor name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mentor Contact Number</label>
                    <input
                      value={form.mentorContact}
                      onChange={(e) => setField("mentorContact", e.target.value)}
                      required
                      inputMode="numeric"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter mentor contact number"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                  <input
                    value={form.couponCode}
                    onChange={(e) => setField("couponCode", e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter coupon code"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Coupon will be applied on the payment page automatically.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={(e) => setField("acceptTerms", e.target.checked)}
                    required
                    className="mt-1 h-4 w-4"
                  />
                  <div>
                    <p className="text-sm text-gray-800 font-semibold mb-1">Terms & Conditions (Required)</p>
                    <p className="text-sm text-gray-700">{TERMS_TEXT}</p>
                    <p className="text-sm text-gray-800 font-semibold mt-3">I accept the Terms and Conditions.</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold py-3 px-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Redirecting to Payment..." : "Continue to Payment"}
              </button>
            </form>
          </div>
        </SignedIn>
          </>
        )}
      </div>
    </div>
  )
}

export default function RegisterFormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <RegisterFormContent />
    </Suspense>
  )
}
