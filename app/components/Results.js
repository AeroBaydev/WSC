"use client"
import { motion } from "framer-motion"

export default function Results() {

  const allResults = [
    {
      id: "jabalpur",
      region: "GD Goenka International School, Jabalpur",
      fileName: "WSC Regional Result_Jabalpur.pdf",
      path: "/Results/WSC Regional Result_Jabalpur.pdf",
      type: "Jabalpur Regional Round Results"
    },
    {
      id: "delhi-ncr",
      region: "Prominence World School,Delhi NCR",
      fileName: "WSC Regional Result_Delhi NCR.pdf",
      path: "/Results/WSC Regional Result_Delhi NCR.pdf",
      type: "Delhi NCR Regional Round Results"
    },
    {
      id: "kolkata",
      region: "Calcutta Public School, Kalikapur, Kolkata",
      fileName: "WSC Regional Result_Kolkata.pdf",
      path: "/Results/WSC Regional Result_Kolkata.pdf",
      type: "Kolkata Regional Round Results"
    },
    {
      id: "kanpur",
      region: "AllenHouse Public School, Rooma, Kanpur",
      fileName: "WSC Regional Result_Kanpur.pdf",
      path: "/Results/WSC Regional Result_Kanpur.pdf",
      type: "Kanpur Regional Round Results"
    },
    {
      id: "maharashtra",
      region: "Meena Bhujbal School of Excellence, Nashik, Maharashtra",
      fileName: "WSC Regional Result_Maharashtra.pdf",
      path: "/Results/WSC Regional Result_Maharashtra.pdf",
      type: "Maharashtra Regional Round Results"
    },
    {
      id: "stars-beyond",
      region: "Stars & Beyond",
      fileName: "WSC-STARS & BEYOND.pdf",
      path: "/Results/WSC-STARS & BEYOND.pdf",
      type: "Quiz Competition Results"
    }
  ]

  const handleViewResult = (path) => {
    window.open(path, '_blank')
  }

  const handleDownloadResult = (path, fileName) => {
    const link = document.createElement('a')
    link.href = path
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <span className="text-orange-500 font-bold text-sm uppercase tracking-wider bg-orange-100 px-4 py-2 rounded-full">
              Results 2025
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent">
            Results 2025
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Check out the results from all regional rounds and quiz competitions of World Skill Challenge 2025
          </p>
        </motion.div>

        {/* All Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-orange-500 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{result.region}</h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-6">{result.type}</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={() => handleViewResult(result.path)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Result
                  </motion.button>
                  <motion.button
                    onClick={() => handleDownloadResult(result.path, result.fileName)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

