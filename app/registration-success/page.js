import { Suspense } from 'react'
import RegistrationSuccessContent from './RegistrationSuccessContent'

export const metadata = {
  title: "Registration Success - World Skill Challenge 2025",
  description: "Your registration for World Skill Challenge 2025 has been successfully completed. Get ready to compete in India's premier student skill competition with cash prizes up to ₹1 Lakh.",
  keywords: [
    "registration successful",
    "World Skill Challenge registered",
    "student competition confirmation",
    "WSC 2025 registration complete",
    "competition registration success",
    "IDEA IGNITE registration",
    "MYSTERY MAKERS registration",
    "TECH FOR GOOD registration",
    "TECH THROTTLE registration"
  ].join(", "),
  alternates: {
    canonical: "https://worldskillchallenge.com/registration-success",
  },
  openGraph: {
    title: "Registration Successful - World Skill Challenge 2025",
    description: "Your registration for World Skill Challenge 2025 has been successfully completed. Welcome to India's premier student skill competition!",
    url: "https://worldskillchallenge.com/registration-success",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Registration Successful - World Skill Challenge 2025",
    description: "Your registration for World Skill Challenge 2025 has been successfully completed.",
  },
  robots: {
    index: false, // This is a success page, shouldn't be indexed
    follow: true,
  },
}

export default function RegistrationSuccess() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://worldskillchallenge.com/registration-success",
          name: "Registration Success - World Skill Challenge 2025",
          description: "Confirmation page for successful registration in World Skill Challenge 2025",
          url: "https://worldskillchallenge.com/registration-success",
          isPartOf: {
            "@type": "WebSite",
            name: "World Skill Challenge 2025",
            url: "https://worldskillchallenge.com"
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://worldskillchallenge.com"
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Registration Success",
                item: "https://worldskillchallenge.com/registration-success"
              }
            ]
          }
        })
      }} />
      <Suspense fallback={<LoadingFallback />}>
        <RegistrationSuccessContent />
      </Suspense>
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Loading...</h1>
        <p className="text-gray-600 mb-8">Please wait while we prepare your registration details.</p>
      </div>
    </div>
  )
}