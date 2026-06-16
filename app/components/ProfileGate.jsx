"use client"

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import RegistrationHistory from "./RegistrationHistory"

export default function ProfileGate() {
  return (
    <>
      <SignedOut>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign in to view your registrations</h2>
          <p className="text-gray-600 mb-6">Your registration history is available after you sign in.</p>
          <SignInButton mode="modal">
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-6 py-3 rounded-lg">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        <RegistrationHistory />
      </SignedIn>
    </>
  )
}
