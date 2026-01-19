"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function QuizPage() {
  const router = useRouter();

  // Quiz is completed - show completion message
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 md:p-12"
      >
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quiz Completed
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              World Skill Challenge – Stars and Beyond
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Regional Results Are Out!
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    The regional round results have been announced. You can view all regional results on the home page.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4 border-t border-orange-200">
                <svg
                  className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Nationals Round - Coming Soon
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Qualified candidates for the Nationals Round will be updated soon. Please stay tuned for further announcements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => router.push("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View Regional Results
            </motion.button>
            <motion.button
              onClick={() => router.push("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Go to Home
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
