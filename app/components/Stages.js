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
      date: "15th October 2025",
    },
    {
      stage: "Stage 2",
      title: "Regional Round",
      description:
        "Present your projects live at regional centers. Showcase your innovations and compete with local teams.",
      icon: "🏆",
      color: "bg-orange-600",
      date: "Mid of November 2025 (Tentative)",
    },
    {
      stage: "Stage 3",
      title: "National Finale",
      description:
        "Top teams from each region compete at the National Finale. The ultimate showdown with industry leaders in attendance.",
      icon: "🥇",
      color: "bg-red-500",
      date: "December 2025 (Tentative)",
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
              { name: "Noida", state: "Delhi NCR", icon: "🏙️", color: "bg-orange-500" },
              { name: "Lucknow", state: "Uttar Pradesh", icon: "🌆", color: "bg-orange-600" },
              { name: "Kolkata", state: "West Bengal", icon: "🏛️", color: "bg-red-500" },
              { name: "Jabalpur", state: "Madhya Pradesh", icon: "🏛️", color: "bg-red-500" },
              { name: "Mumbai", state: "Maharashtra", icon: "🏘️", color: "bg-red-600" },
              { name: "Nagpur", state: "Maharashtra", icon: "🏢", color: "bg-orange-500" },
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
                      <div className={`w-12 h-12 ${location.color} rounded-full flex items-center justify-center mr-4`}>
                        <span className="text-xl md:text-2xl">{location.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-orange-500">Regional Center</h3>
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
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 ${location.color} rounded-full flex items-center justify-center`}
                  >
                    <span className="text-2xl md:text-3xl">{location.icon}</span>
                  </div>
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
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">📍 More Locations Coming Soon!</h3>
                  <p className="text-orange-100 text-lg">Additional regional centers will be announced soon to ensure accessibility across India.</p>
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
                  <h4 className="font-bold text-lg mb-2">Registration Deadline</h4>
                  <p className="text-orange-100 text-sm">15th October 2025</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 rounded-xl p-6 backdrop-blur-sm border border-white/30"
                >
                  <div className="text-3xl mb-3">🏆</div>
                  <h4 className="font-bold text-lg mb-2">Regional Rounds</h4>
                  <p className="text-orange-100 text-sm">Mid of November 2025 (Tentative)</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 rounded-xl p-6 backdrop-blur-sm border border-white/30"
                >
                  <div className="text-3xl mb-3">🥇</div>
                  <h4 className="font-bold text-lg mb-2">National Finale</h4>
                  <p className="text-orange-100 text-sm">December 2025 (Tentative)</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
