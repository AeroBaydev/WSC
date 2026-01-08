import Register from "../components/Register"

export const metadata = {
  title: "Register - World Skill Challenge 2025",
  description: "Register for World Skill Challenge 2025! Choose from ExperienceX (STEAM/Robotics) or SoarFest (Aeromodelling) competitions. Win up to ₹1 Lakh in cash prizes. Sign in to register now.",
  alternates: {
    canonical: "https://worldskillchallenge.com/register",
  },
  openGraph: {
    title: "Register - World Skill Challenge 2025",
    description: "Register for World Skill Challenge 2025 and compete for cash prizes up to ₹1 Lakh!",
    url: "https://worldskillchallenge.com/register",
  },
}

export default function RegisterPage() {
  return <Register />
}

