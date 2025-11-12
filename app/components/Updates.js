"use client"
import { motion } from "framer-motion"

export default function Updates() {
  const stages = [
    {
      phase: "Phase 1",
      title: "Registration & Submission",
      date: "September-October 2025",
      description: "Open registration and project submission period",
      status: "Completed",
    },
    {
      phase: "Phase 2",
      title: "Initial Screening",
      date: "November 2025",
      description: "Evaluation and shortlisting of submissions",
      status: "Ongoing",
    },
    {
      phase: "Phase 3",
      title: "Semi-Finals",
      date: "December 2025",
      description: "Presentation and demonstration rounds",
      status: "upcoming",
    },
    {
      phase: "Phase 4",
      title: "Grand Finale",
      date: "To Be Announced",
      description: "Final competition and award ceremony",
      status: "upcoming",
    },
  ]

  return (
    <section id="updates" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8">Competition Updates</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed about the latest developments and timeline for World Skill Challenge 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Competition Stages & Timeline
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stages.map((stage, index) => (
              <motion.div
                key={stage.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 card-shadow hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <div className="text-sm text-orange-500 font-semibold mb-2">{stage.phase}</div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{stage.title}</h4>
                <div className="text-sm text-gray-600 mb-3">{stage.date}</div>
                <p className="text-gray-600 text-sm">{stage.description}</p>
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                    {stage.status === "upcoming" ? "Upcoming" : "Active"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="orange-accent rounded-lg p-8 text-center card-shadow-lg"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Stay Connected</h3>
          <p className="text-white/90 text-lg mb-6">
            For more updates and detailed information about the competition, stay connected with us through our official
            channels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>Official Website Updates</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span>Email Notifications</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
