"use client"
import { motion } from "framer-motion"

export default function Stages() {
  const stages = [
    {
      stage: "Stage 1",
      title: "Registration & Online Submission",
      description: "Register for your chosen category and submit your initial ideas, reports, or videos online.",
      icon: "📝",
      color: "bg-orange-500",
      date: "Regsitration Closed",
    },
    {
      stage: "Stage 2",
      title: "Regional Round",
      description:
        "Present your projects live at regional centers. Showcase your innovations and compete with local teams.",
      icon: "🏆",
      color: "bg-orange-600",
      date: " Mentioned Below With Complete Details",
    },
    {
      stage: "Stage 3",
      title: "National Finale",
      description:
        "Top teams from each region compete at the National Finale. The ultimate showdown with industry leaders in attendance.",
      icon: "🥇",
      color: "bg-red-500",
      date: "January 2026",
    },
    {
      stage: "Stage 4",
      title: "International Round",
      description: "National winners get the opportunity to represent their country on the global stage!",
      icon: "🌍",
      color: "bg-red-600",
      date: "To Be Announced",
    },
  ]

  return (
    <section id="stages" className="py-20 bg-top bg-repeat relative" style={{backgroundImage: 'url(/images/stagesbg.jpg)', backgroundSize: '50%'}}>
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-white/80"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8">Competition Stages</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your journey from registration to international recognition
          </p>
        </motion.div>

        <div className="space-y-8 md:space-y-12">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? "" : "md:flex-row-reverse"} gap-8`}
            >
              <div className="w-full md:w-1/2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg p-6 md:p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${stage.color} rounded-full flex items-center justify-center mr-4`}>
                      <span className="text-xl md:text-2xl">{stage.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-orange-500">{stage.stage}</h3>
                      <h4 className="text-lg md:text-xl font-bold text-gray-900">{stage.title}</h4>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">{stage.description}</p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-orange-700 font-semibold text-sm">📅 {stage.date}</p>
                  </div>
                </motion.div>
              </div>

              <div className="w-full md:w-1/2 flex justify-center">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 ${stage.color} rounded-full flex items-center justify-center`}
                >
                  <span className="text-2xl md:text-3xl">{stage.icon}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Regional Locations Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8">Regional Locations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Regional rounds will be conducted across multiple cities in India
            </p>
          </motion.div>

          <div className="space-y-8 md:space-y-12">
            {[
              {
                name: "GD Goenka International School, Jabalpur",
                state: "Madhya Pradesh",
                icon: "🏢",
                date: "29th November 2025",
                color: "bg-red-500",
                mapUrl: "https://www.google.com/maps/search/?api=1&query=GD+Goenka+International+School+Jabalpur",
              },
              {
                name: "Prominence World School, Greater Noida",
                state: "Delhi NCR",
                icon: "🏙️",
                date: "6th December 2025",
                color: "bg-orange-500",
                mapUrl: "https://www.google.com/maps/search/?api=1&query=Prominence+World+School+Noida",
              },
              {
                name: "Calcutta Public School, Kalikapur",
                state: "West Bengal",
                icon: "🏛️",
                date: "13th December 2025",
                color: "bg-red-500",
                mapUrl: "https://www.google.com/maps/search/?api=1&query=Calcutta+Public+School+Kalikapur+Kolkata",
              },
              {
                name: "AllenHouse Public School, Rooma ",
                state: "Uttar Pradesh",
                icon: "🌆",
                date: "20th December 2025",
                color: "bg-orange-600",
                mapUrl: "https://www.google.com/maps/search/?api=1&query=Allen+House+Rooma+School+Kanpur",
              },
              {
                name: "⁠Meena Bhujbal School of Excellence, Nashik",
                state: "Maharashtra",
                icon: "🏘️",
                date: "11th January 2026",
                color: "bg-red-600",
                mapUrl: "https://maps.app.goo.gl/ggRb49bA8K4UDZHZ8",
              },
            ].map((location, index) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? "" : "md:flex-row-reverse"} gap-8`}
              >
                <div className="w-full md:w-1/2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-lg p-6 md:p-8 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center mb-4">
                      <a
                        href={location.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 ${location.color} rounded-full flex items-center justify-center mr-4 transition-transform duration-200 hover:scale-105 focus-visible:scale-105`}
                        aria-label={`Open map for ${location.name}`}
                      >
                        <span className="text-xl md:text-2xl">{location.icon}</span>
                      </a>
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-orange-500">Regional: <span className="text-violet-500">{location.state} @ {location.date}</span></h3>
                        <h4 className="text-lg md:text-xl font-bold text-gray-900">{location.name}</h4>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">
                      Regional competition venue for {location.state} region. Students from this area will compete here during the regional round.
                    </p>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-orange-700 font-semibold text-sm">📍 {location.state}</p>
                    </div>
                  </motion.div>
                </div>

                <div className="w-full md:w-1/2 flex justify-center">
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-16 h-16 md:w-20 md:h-20 ${location.color} rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 focus-visible:scale-110`}
                    aria-label={`Open map for ${location.name}`}
                  >
                    <span className="text-2xl md:text-3xl">{location.icon}</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl"></div>
              <div className="relative orange-accent rounded-2xl p-8 md:p-12 text-center card-shadow-lg border-4 border-orange-200">
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="mb-6"
                >
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">📍 Nationals Location and Date Revealing Soon!</h3>
                  <p className="text-orange-100 text-lg">Nationals centers will be announced soon to ensure accessibility across India.</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          {/* Highlighted Timeline Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl"></div>
            <div className="relative orange-accent rounded-2xl p-8 md:p-12 text-center card-shadow-lg border-4 border-orange-200">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">🗓️ Competition Timeline</h3>
                <p className="text-orange-100 text-lg">Mark your calendars for these important dates!</p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6 text-white">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 rounded-xl p-6 backdrop-blur-sm border border-white/30"
                >
                  <div className="text-3xl mb-3">📝</div>
                  <h4 className="font-bold text-lg mb-2">Registration Closed</h4>
                  <p className="text-orange-100 text-sm">😎</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 rounded-xl p-6 backdrop-blur-sm border border-white/30"
                >
                  <div className="text-3xl mb-3">🏆</div>
                  <h4 className="font-bold text-lg mb-2">Regional Rounds</h4>
                  <p className="text-orange-100 text-sm">Mentioned Above With Complete Details</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 rounded-xl p-6 backdrop-blur-sm border border-white/30"
                >
                  <div className="text-3xl mb-3">🥇</div>
                  <h4 className="font-bold text-lg mb-2">National Finale</h4>
                  <p className="text-orange-100 text-sm">January 2026</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
