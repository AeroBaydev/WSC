import ProfileGate from "../components/ProfileGate"

export const metadata = {
  title: "My Registrations - World Skill Challenge",
  description: "View your World Skill Challenge and SoarFest registration history across all seasons.",
  alternates: {
    canonical: "https://worldskillchallenge.com/profile",
  },
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">My Registrations</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your complete participation history across all seasons, including category, team details, and payment
            status.
          </p>
        </div>
        <ProfileGate />
      </div>
    </div>
  )
}
